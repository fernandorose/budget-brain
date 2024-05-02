import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import styles from "../../styles/budget.module.scss";
import ConfirmationDelete from "./ConfirmationDelete";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import axios from "axios";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:3000";

const BudgetDetail = () => {
  const navigate = useNavigate();
  const { budgetId } = useParams();
  const [budget, setBudget] = useState({});
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [limitAmount, setLimitAmount] = useState("");

  useEffect(() => {
    const socket = io(ENDPOINT);

    socket.on("category_created", (newCateory) => {
      setCategories((prevCategories) => [...prevCategories, newCateory]);
    });

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/budget/get/${budgetId}`
        );
        setBudget(response.data);
      } catch (error) {
        console.error("Error al obtener los datos:", error.message);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/categories/get/${budgetId}`
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error al obtener los datos:", error.message);
      }
    };

    fetchData();
    fetchCategories();

    return () => {
      socket.disconnect();
    };
  }, [budgetId]);

  const handleDelete = () => {
    setIsModalOpen(true);
  };

  const handleDeleteConfirmed = async (confirmationText) => {
    if (!confirmationText) {
      return toast.error(
        "Por favor, ingresa el nombre del presupuesto para confirmar la eliminación."
      );
    }

    if (confirmationText !== budget.name) {
      return toast.error("El nombre del presupuesto ingresado es incorrecto.");
    }

    try {
      await axios.delete(`http://localhost:3000/api/budget/delete/${budgetId}`);
      setDeleted(true);
      navigate("/budget");
    } catch (error) {
      console.error("Error al eliminar el presupuesto:", error.message);
    }
  };

  const formatDate = (dateString) => {
    return dateString
      ? format(new Date(dateString), "EEEE, d MMMM yyyy HH:mm")
      : "";
  };

  const handleCreateCategory = async () => {
    if (!categoryName || !limitAmount) {
      return toast.error(
        "Por favor, ingresa el nombre y el monto límite de la categoría."
      );
    }

    try {
      await axios.post(
        `http://localhost:3000/api/categories/create/${budgetId}`,
        {
          name: categoryName,
          limit: parseFloat(limitAmount),
        }
      );
    } catch (error) {
      console.error("Error al crear la categoría:", error.message);
    }
  };

  const handleCategoryNameChange = (event) => {
    setCategoryName(event.target.value);
  };

  const handleLimitAmountChange = (event) => {
    setLimitAmount(event.target.value);
  };

  return (
    <>
      <ToastContainer
        hideProgressBar
        theme="dark"
        draggable
        stacked
        position="bottom-center"
      />
      <main className={styles.detailsContainer}>
        <div className={styles.data}>
          <div className={styles.detailsTitle}>
            <span> {budget.id}</span>
            <h1>{budget.name}</h1>
            <h3>{formatDate(budget.createdAt)}</h3>
          </div>
          <div className={styles.input}>
            <h1>Budget categories:</h1>
            <div>
              <input
                type="text"
                placeholder="Category name"
                value={categoryName}
                onChange={handleCategoryNameChange}
              />
              <input
                type="text"
                placeholder="Limit amount"
                value={limitAmount}
                onChange={handleLimitAmountChange}
              />
              <button onClick={handleCreateCategory}>
                Create new category
              </button>
            </div>
          </div>
        </div>

        <div className={styles.categoriesContainer}>
          {categories.map((category) => (
            <Link
              className={styles.categoryContainer}
              to={`/budget/${budget.id}/category/${category.id}`}
              key={category.id}
            >
              <div className={styles.categoryTitle}>
                <span>{category.id}</span>
                <h1>{category.name}</h1>
              </div>
              <div className={styles.pricing}>
                <div>
                  <span>Actual limit amount</span>
                  <h3>${category.limit}</h3>
                </div>
                <div className={styles.original}>
                  <span>Original limit amount</span>
                  <h3>${category.original_limit}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <footer className={styles.budgetFooter}>
          <button onClick={handleDelete}>Delete this budget</button>
        </footer>
      </main>
      <ConfirmationDelete
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onDeleteConfirmed={handleDeleteConfirmed}
        budgetName={budget.name}
      />
    </>
  );
};

export default BudgetDetail;
