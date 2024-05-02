import { Link, useNavigate } from "react-router-dom";
import Cookie from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { format } from "date-fns";
import styles from "../../styles/budget.module.scss";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Budget = () => {
  const navigate = useNavigate();

  const [budget, setBudget] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [budgetName, setBudgetName] = useState("");

  const sessionCookie = Cookie.get("session");
  const decodeToken = jwtDecode(sessionCookie);
  const userName = decodeToken.userName;

  useEffect(() => {
    if (!sessionCookie) {
      navigate("/signin");
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/budgets/get/${decodeToken.userId}`
        );
        setBudget(response.data);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
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
      navigate(0);
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
          {budget.map((budget) => (
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
