import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleSignUp = async () => {
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
      <main>
        <h1>SignUp</h1>
        <div>
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
        </div>
      </main>
    </>
  );
};

export default SignUp;
