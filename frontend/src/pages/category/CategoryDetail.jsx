import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "../../styles/transaction.module.scss";
import { format } from "date-fns";
import Cookie from "js-cookie";
import { jwtDecode } from "jwt-decode";
import axios from "axios"; // Agregar importación de axios
import io from "socket.io-client";

const ENDPOINT = "http://localhost:3000";

const CategoryDetail = () => {
  const { categoryId } = useParams();

  const sessionCookie = Cookie.get("session");
  const decodeToken = jwtDecode(sessionCookie);
  const userName = decodeToken.userName;

  const [description, setDescription] = useState(""); // Estado para descripción
  const [amount, setAmount] = useState(""); // Estado para cantidad
  const [type, setType] = useState("expense"); // Estado para tipo (por defecto "expense")
  const [category, setCategory] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const socket = io(ENDPOINT);

    socket.on("transaction_created", (newTransaction) => {
      setTransactions((prevTransactions) => [
        ...prevTransactions,
        newTransaction,
      ]);
    });
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
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleCreateTransaction = async () => {
    try {
      await axios.post(
        `http://localhost:3000/api/transactions/create/${decodeToken.userId}/${categoryId}`,
        {
          description: description,
          amount: parseFloat(amount),
          type,
        }
      );
    } catch (error) {
      console.error("Error al crear la transaccion:", error.message);
    }
  };

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
          <div className={styles.input}>
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              type="text"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <button onClick={handleCreateTransaction}>
              Create Transaction
            </button>
          </div>
        </div>
        <div className={styles.transactions}>
          {transactions.length === 0 ? (
            <div className={styles.empty}>
              <p>There's no transactions.</p>
            </div>
          ) : (
            transactions.map((transaction) => (
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
            ))
          )}
        </div>
      </main>
    </>
  );
};

export default CategoryDetail;
