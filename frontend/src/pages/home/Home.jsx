import react, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Cookie from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { format } from "date-fns";
import styles from "../../styles/home.module.scss";

const Home = () => {
  const navigate = useNavigate();

  const [budget, setBudget] = react.useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const sessionCookie = Cookie.get("session");
  const decodeToken = jwtDecode(sessionCookie);
  const userName = decodeToken.userName;

  return (
    <>
      <main className={styles.homeContainer}>
        <nav>
          <h1>side</h1>
        </nav>
        <div className={styles.content}>
          <div className={styles.titleContainer}>
            <div className={styles.id}>
              <span>{userName}</span>
              <h5>{decodeToken.userId}</h5>
            </div>
            {showDropdown && (
              <div className={styles.dropdownContent}>
                {/* Contenido del dropdown aquí */}
                <h1>Hello World</h1>
              </div>
            )}
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
