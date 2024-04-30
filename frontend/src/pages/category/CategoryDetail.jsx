import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "../../styles/transaction.module.scss";
import { format } from "date-fns";

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

  const formatDate = (dateString) => {
    return dateString
      ? format(new Date(dateString), "EEEE, d MMMM yyyy HH:mm")
      : "";
  };

  return (
    <>
      <main className={styles.transactionsContainer}>
        <div className={styles.transactionsTitle}>
          <h1>Transactions</h1>
        </div>
        <div className={styles.transactions}>
          {transactions.map((transaction) => (
            <div
              className={`${styles.transactionContainer} ${
                transaction.type === "expense"
                  ? styles.expenseTransaction
                  : styles.incomeTransaction
              }`}
              key={transaction.id}
            >
              <div className={styles.transactionTitle}>
                <span>{transaction.id}</span>
                <h1>{transaction.description}</h1>
                <h3 className={styles.date}>
                  {formatDate(transaction.createdAt)}
                </h3>
              </div>
              <div className={styles.amounts}>
                <span>{transaction.type}</span>

                <h4>Transaction amount:</h4>
                <h3>${transaction.amount}</h3>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default CategoryDetail;
