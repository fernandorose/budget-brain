import React, { useEffect, useState } from "react";
import Cookie from "js-cookie";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import styles from "../../styles/sign.module.scss";

const SignIn = () => {
  const navigate = useNavigate();
  const sessionCookie = Cookie.get("session");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (sessionCookie) {
      navigate("/");
    }
  });

  const handleSignIn = async () => {
    if (!email || !password) {
      toast.error("Please fill all inputs");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }
      const data = await response.json();
      console.log("Respuesta del servidor:", data);
      Cookie.set("session", data);
      navigate("/");
    } catch (error) {
      console.error("Error al realizar la solicitud:", error.message);
      // Manejar el error, mostrar un mensaje al usuario, etc.
    }
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
      <main className={styles.signContainer}>
        <div className={styles.input}>
          <img src="/logo.svg" alt="" />
          <h1>SignIn</h1>
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleSignIn}>Sign in</button>
          <p>
            Don't have an account? <Link to={"/signup"}>Sign up</Link>
          </p>
        </div>
      </main>
    </>
  );
};

export default SignIn;
