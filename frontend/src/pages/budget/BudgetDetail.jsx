import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import styles from "../../styles/budget.module.scss";
import ConfirmationDelete from "./ConfirmationDelete";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";

const BudgetDetail = () => {
  const navigate = useNavigate();
  const { budgetId } = useParams();
  const [budget, setBudget] = useState({});
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/budget/get/${budgetId}`
        );
        if (!response.ok) {
          throw new Error("Error al obtener los datos");
        }
        const responseData = await response.json();
        setBudget(responseData);
      } catch (error) {
        console.error("Error al obtener los datos:", error.message);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/categories/get/${budgetId}`
        );
        if (!response.ok) {
          throw new Error("Error al obtener los datos");
        }
        const categories = await response.json();
        setCategories(categories);
      } catch (error) {
        console.error("Error al obtener los datos:", error.message);
      }
    };

    fetchData();
    fetchCategories();
  }, [budgetId]);

  const handleDelete = () => {
    setIsModalOpen(true);
  };

  const handleDeleteConfirmed = async (confirmationText) => {
    if (!confirmationText) {
      // Mostrar notificación de error si no se proporcionó ningún texto
      return toast.error(
        "Por favor, ingresa el nombre del presupuesto para confirmar la eliminación."
      );
    }

    if (confirmationText !== budget.name) {
      // Mostrar notificación de error si el nombre ingresado no coincide con el nombre del presupuesto
      return toast.error("El nombre del presupuesto ingresado es incorrecto.");
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/budget/delete/${budgetId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar el presupuesto");
      }

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
        <div className={styles.detailsTitle}>
          <span> {budget.id}</span>
          <h1>{budget.name}</h1>
          <h3>{formatDate(budget.createdAt)}</h3>
        </div>
        <div className={styles.categoriesContainer}>
          <h1>Categories:</h1>
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
