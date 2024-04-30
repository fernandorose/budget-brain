import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookie from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { format } from "date-fns";
import styles from "../../styles/home.module.scss";

const Home = () => {
  const navigate = useNavigate();

  const [budget, setBudget] = useState([]);

  const sessionCookie = Cookie.get("session");
  const decodeToken = jwtDecode(sessionCookie);
  const userName = decodeToken.userName;

  useEffect(() => {
    if (!sessionCookie) {
      navigate("/signin");
    }

    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/budgets/get/${decodeToken.userId}`
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

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    return format(new Date(dateString), "EEEE, d MMMM yyyy HH:mm");
  };

  return (
    <>
      <main className={styles.homeContainer}>
        <div className={styles.titleContainer}>
          <h1>Hello ::</h1>
          <div className={styles.id}>
            <span>{userName}</span>
            <h5>{decodeToken.userId}</h5>
          </div>
        </div>
        <div className={styles.budgetsContainer}>
          <div className={styles.budgetsTitle}>
            <h1>Your budgets:</h1>
          </div>
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
      </main>
    </>
  );
};

export default Home;
