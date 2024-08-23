import "./styles/MainPage.css";
import TextField from "@mui/material/TextField";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function MainPage() {
  const navigate = useNavigate();
  // State for modal visibility
  const [showModal, setShowModal] = useState(0); //0 - nie pokazuj, 1 - logowanie, 2 - rejestracja
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailRegister, setEmailRegister] = useState("");
  const [passwordRegister, setPasswordRegister] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [fullName, setFullNameRegister] = useState("");

  // State for login status
  const [isLogged, setIsLogged] = useState(false);
  const [collections, setCollections] = useState([]);

  // Refs for login fields
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const fullNameRef = useRef(null);
  const emailRegisterRef = useRef(null);
  const passwordRegisterRef = useRef(null);
  const passwordRepeatRef = useRef(null);

  const handleSzukajClick = () => {
    navigate("/SzukajZbiorke.jsx");
  };

  const handleLogujWylogujClick = () => {
    if (isLogged) {
      setIsLogged(false);
    } else {
      setShowModal(1);
    }
  };

  const handleLogujZalogujClick = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8081/auth/signin",
        {
          email: email,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Login successful!");
      const { jwt } = response.data;
      localStorage.setItem("token", jwt);
      setIsLogged(true);
      setShowModal(0);
    } catch (error) {
      console.error("Błąd logowania:", error);
    }
  };

  const handleRejestrujZarejestrujClick = async () => {
    try {
      await axios.post(
        "http://localhost:8081/auth/signup",
        {
          fullName: fullName,
          email: emailRegister,
          password: passwordRegister,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Signup successful!");
      setIsLogged(true);
      setShowModal(0);
    } catch (error) {
      console.error("Błąd rejestracji:", error);
    }
  };

  const handleRejestrujClick = () => {
    setShowModal(2);
  };

  const handleCloseModal = () => {
    setShowModal(0);
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      handleCloseModal();
    }
  };

  const handleZbiorkaClick = (collection) => {
    navigate("/ZbiorkaSzczegoly.jsx", { state: { collection } });
  };

  const handleTworzClick = () => {
    if (isLogged) {
      navigate("/StworzZbiorke.jsx");
    } else {
      handleLogujWylogujClick();
    }
  };

  const handleTwojeClick = () => {
    if (isLogged) {
      navigate("/ZarzadzajZbiorkami.jsx");
    } else {
      handleLogujWylogujClick();
    }
  };

  const showCollections = async () => {
    try {
      const response = await axios.get("http://localhost:8081/all_collections");
      console.log("Poprawnie pobrano zbiorki:", response.data);
      setCollections(response.data);
    } catch (error) {
      console.error("Błąd pobierania zbiorek:", error);
    }
  };

  useEffect(() => {
    showCollections();
    console.log("Pobrane kolekcje:", collections);
  }, []);

  // Function to handle keydown events in the login modal
  const handleKeyLogin = (e) => {
    if (e.key === "Enter") {
      handleLogujZalogujClick();
    } else if (e.key === "ArrowDown") {
      if (e.target === emailRef.current) {
        passwordRef.current.focus();
      }
    } else if (e.key === "ArrowUp") {
      if (e.target === passwordRef.current) {
        emailRef.current.focus();
      }
    }
  };

  const handleKeyRegister = (e) => {
    if (e.key === "Enter") {
      handleRejestrujZarejestrujClick();
    } else if (e.key === "ArrowDown") {
      if (e.target === fullNameRef.current) {
        emailRegisterRef.current.focus();
      } else if (e.target === emailRegisterRef.current) {
        passwordRegisterRef.current.focus();
      } else if (e.target === passwordRegisterRef.current) {
        passwordRepeatRef.current.focus();
      }
    } else if (e.key === "ArrowUp") {
      if (e.target === emailRegisterRef.current) {
        fullNameRef.current.focus();
      }
      if (e.target === passwordRegisterRef.current) {
        emailRegisterRef.current.focus();
      }
      if (e.target === passwordRepeatRef.current) {
        passwordRegisterRef.current.focus();
      }
    }
  };

  return (
    <div className={`all-main-page ${showModal != 0 ? "modal-active" : ""}`}>
      <div className="gorne-buttony">
        <div className="button-tworz-szukaj">
          <button className="button-twoje" onClick={handleTwojeClick}>
            Twoje zbiórki
          </button>
          <button className="button-tworz" onClick={handleTworzClick}>
            Stwórz zbiórkę
          </button>
          <button className="button-szukaj" onClick={handleSzukajClick}>
            Szukaj zbiórkę 🔍︎
          </button>
        </div>
        <div className="button-loguj-rejestruj">
          <button className="button-loguj" onClick={handleLogujWylogujClick}>
            {!isLogged ? "Zaloguj się" : "Wyloguj się"}
          </button>
          <button className="button-rejestruj" onClick={handleRejestrujClick}>
            Zarejestruj się
          </button>
        </div>
      </div>

      <div className="main-page-grid">
        {collections.map((collection, index) => (
          <div
            className="main-page-content"
            onClick={() => handleZbiorkaClick(collection)}
            key={index}
          >
            <div className="collection-frame">
              <p className="collection-title">{collection.collectionGoal}</p>
              {collection.images && collection.images.length > 0 && (
                <img
                  src={`data:image/jpeg;base64,${collection.images[0].imageData}`}
                  className="collection-image"
                  alt="zdjecie"
                />
              )}
              <p className="collection-description">{collection.description}</p>
              <p className="collection-funds">
                Zbierane pieniądze: {collection.collectionAmount} zł
              </p>
            </div>
          </div>
        ))}
      </div>

      {showModal == 1 && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div className="modal">
            <h2>{"Logowanie"}</h2>
            <TextField
              label="Email"
              variant="outlined"
              size="small"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              inputRef={emailRef}
              onKeyDown={handleKeyLogin}
            />
            <TextField
              label="Hasło"
              variant="outlined"
              size="small"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              inputRef={passwordRef}
              onKeyDown={handleKeyLogin}
            />
            <button onClick={handleLogujZalogujClick}>Zaloguj się</button>
          </div>
        </div>
      )}

      {showModal == 2 && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div className="modal">
            <h2>{"Rejestracja"}</h2>
            <TextField
              label="Imię i nazwisko"
              margin="normal"
              size="small"
              variant="outlined"
              value={fullName}
              onChange={(e) => setFullNameRegister(e.target.value)}
              inputRef={fullNameRef}
              onKeyDown={handleKeyRegister}
            />
            <TextField
              label="Email"
              variant="outlined"
              size="small"
              margin="normal"
              value={emailRegister}
              onChange={(e) => setEmailRegister(e.target.value)}
              inputRef={emailRegisterRef}
              onKeyDown={handleKeyRegister}
            />
            <TextField
              label="Hasło"
              variant="outlined"
              size="small"
              margin="normal"
              value={passwordRegister}
              onChange={(e) => setPasswordRegister(e.target.value)}
              inputRef={passwordRegisterRef}
              onKeyDown={handleKeyRegister}
            />
            <TextField
              label="Powtórz hasło"
              margin="normal"
              size="small"
              variant="outlined"
              value={passwordRepeat}
              onChange={(e) => setPasswordRepeat(e.target.value)}
              inputRef={passwordRepeatRef}
              onKeyDown={handleKeyRegister}
            />

            <button onClick={handleRejestrujZarejestrujClick}>
              Zarejestruj się
            </button>
          </div>
        </div>
      )}

      {/* <footer>All rights reserved.</footer> */}
    </div>
  );
}

export default MainPage;
