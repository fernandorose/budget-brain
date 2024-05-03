import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import styles from "../../styles/sign.module.scss";

const SignUp = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !password) {
      toast.error("Please fill all inputs");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          first_name: firstName,
          last_name: lastName,
        }),
      });
      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }
      const data = await response.json();
      console.log("Respuesta del servidor:", data);
      navigate("/signin");
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
          <h1>SignUp</h1>
          <input
            type="text"
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
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
          <button onClick={handleSignUp}>Sign up</button>
          <p>
            Already have an account?<Link to={"/signin"}>Sign in</Link>
          </p>
        </div>
      </main>
    </>
  );
};

export default SignUp;
