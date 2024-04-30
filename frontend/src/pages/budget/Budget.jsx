import react from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookie from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { format } from "date-fns";
import styles from "../../styles/budget.module.scss";

const Budget = () => {
  const navigate = useNavigate();

  const [budget, setBudget] = react.useState([]);

  const sessionCookie = Cookie.get("session");
  const decodeToken = jwtDecode(sessionCookie);
  const userName = decodeToken.userName;

  react.useEffect(() => {
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
    </>
  );
};

export default Budget;
