import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import { Link, useNavigate } from "react-router-dom";
import Cookie from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { format } from "date-fns";
import styles from "../../styles/budget.module.scss";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ENDPOINT = "http://localhost:3000"; // Cambia esto por la URL de tu servidor WebSocket

const Budget = () => {
  const navigate = useNavigate();

  const [budgets, setBudgets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [budgetName, setBudgetName] = useState("");

  const sessionCookie = Cookie.get("session");
  const decodeToken = jwtDecode(sessionCookie);
  const userName = decodeToken.userName;

  useEffect(() => {
    if (!sessionCookie) {
      navigate("/signin");
    }

    const socket = io(ENDPOINT);

    // Escuchar eventos de WebSocket para la creación de un nuevo presupuesto
    socket.on("budget_created", (newBudget) => {
      setBudgets((prevBudgets) => [...prevBudgets, newBudget]);
    });

    // Obtener la lista inicial de presupuestos
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/budgets/get/${decodeToken.userId}`
        );
        setBudgets(response.data);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();

    return () => {
      socket.disconnect();
    };
  }, []);

  const formatDate = (dateString) => {
    return format(new Date(dateString), "EEEE, d MMMM yyyy HH:mm");
  };

  const handleCreateBudget = async () => {
    if (!budgetName) {
      toast.error("Please enter a budget name");
      return;
    }

    try {
      await axios.post(
        `http://localhost:3000/api/budgets/create/${decodeToken.userId}`,
        {
          name: budgetName,
        }
      );
      setBudgetName(""); // Limpiar el campo de nombre después de crear el presupuesto
    } catch (error) {
      console.error("Error creating budget:", error.message);
    }
  };

  const handleChange = (event) => {
    setBudgetName(event.target.value);
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
      <div className={styles.budgetsContainer}>
        <div className={styles.budgetsTitle}>
          <h1>Your budgets:</h1>
          <div className={styles.input}>
            <input
              type="text"
              placeholder="Budget name"
              value={budgetName}
              onChange={handleChange}
            />
            <button onClick={handleCreateBudget}>Create new budget</button>
          </div>
        </div>
        <div className={styles.dataContainer}>
          {budgets.map((budget) => (
            <Link
              className={styles.budgetsData}
              to={`/budget/${budget.id}`}
              key={budget.id}
            >
              <h1>{budget.name}</h1>
              <span>Created: </span>
              <h3>{formatDate(budget.createdAt)}</h3>
              <span className={styles.budgetId}>{budget.id}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Budget;
