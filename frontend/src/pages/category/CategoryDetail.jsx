import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CategoryDetail = () => {
  const { categoryId } = useParams();

  const [category, setCategory] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/transactions/get/${categoryId}`
        );
        if (!response.ok) {
          throw new Error("Error al obtener los datos");
        }
        const transactions = await response.json();
        setTransactions(transactions);
      } catch (error) {
        console.error("Error al obtener los datos:", error.message);
      }
    };
    fetchTransactions();
  }, []);

  return (
    <>
      <main>
        <h1>{categoryId}</h1>
        <div>
          {transactions.map((transaction) => (
            <div key={transaction.id}>
              <h1>{transaction.description}</h1>
              <h3>${transaction.amount}</h3>
              <h3>{transaction.createdAt}</h3>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default CategoryDetail;
