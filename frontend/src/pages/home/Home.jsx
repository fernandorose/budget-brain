import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import styles from "../../styles/home.module.scss";
import Cookie from "js-cookie";
import axios from "axios";
import Chat from "../../components/Chat";

const Home = () => {
  const navigate = useNavigate();
  const [generatedMessage, setGeneratedMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const sessionCookie = Cookie.get("session");
  const decodeToken = jwtDecode(sessionCookie);
  const userName = decodeToken.userName;

  // const fetchMessage = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await axios.get(
  //       "http://localhost:3000/generate-message"
  //     );
  //     setGeneratedMessage(response.data.message.choices[0].message.content);
  //   } catch (error) {
  //     console.error("Error:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchMessage();
  // }, []);

  return (
    <>
      <main className={styles.homeContainer}>
        <div className={styles.aside}>
          <Chat />
        </div>
        <div className={styles.content}>
          <div className={styles.titleContainer}>
            <div className={styles.id}>
              <span>{userName}</span>
              <h5>{decodeToken.userId}</h5>
            </div>
          </div>
          <div className={styles.mainContainer}>
            <Outlet />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
