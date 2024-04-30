import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { format } from "date-fns";

const BudgetDetail = () => {
  const { budgetId } = useParams();

  const [budget, setBudget] = useState({});
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);

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

  const formatDate = (dateString) => {
    return format(new Date(dateString), "EEEE, d MMMM yyyy HH:mm");
  };

  return (
    <>
      <main>
        <div>
          <h1>{budget.name}</h1>
          <h3>{budget.createdAt}</h3>
        </div>
        <div>
          <h1>Budget categories</h1>
          {categories.map((category) => (
            <Link to={`/budget/category/${category.id}`} key={category.id}>
              <div>
                <h1>{category.name}</h1>
                <h3>${category.limit}</h3>
                <h3>${category.original_limit}</h3>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
};

export default BudgetDetail;
