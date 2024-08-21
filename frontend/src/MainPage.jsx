import "./styles/MainPage.css";
import TextField from '@mui/material/TextField';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Add this line to import axios
import batman4k from "./assets/batman4k.jpg";
import homelander from "./assets/homelander.jpg";
import joker from "./assets/joker.jpg";

function MainPage() {
  const [showModal, setShowModal] = useState(0); //0 - nie pokazuj, 1 - logowanie, 2 - rejestracja
  const navigate = useNavigate();
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [emailRegister, setEmailRegister] = useState('');
  const [passwordRegister, setPasswordRegister] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [fullName, setFullNameRegister] = useState('');

  const [isLogged, setIsLogged] = useState(true);

  const handleSzukajClick = () => {
    navigate("/SzukajZbiorke.jsx");
    // window.location.href = "./SzukajZbiorke.jsx";
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
      const response = await axios.post('http://localhost:8081/auth/signin', {
        email: email,
        password: password   
      });
      console.log('Login successful:', response.data); 
      const { jwt } = response.data;
      localStorage.setItem('token', jwt); // Zapisz token w localStorage
      console.log('Token saved:', jwt);
      // Jeśli logowanie się powiedzie, ustaw stan jako zalogowany
      setIsLogged(true);
      setShowModal(0); // Zamknij modal po zalogowaniu
      
    } catch (error) {
      console.error('Błąd logowania:', error);
      // Możesz wyświetlić komunikat o błędzie w modalu
    }
  };

  const handleRejestrujZarejestrujClick = async () => {
    try {
      const response = await axios.post('http://localhost:8081/auth/signup', {
        fullName: fullName,
        email: emailRegister,
        password: passwordRegister,
      });
      console.log('Signup successful:', response.data); 
      
      // Jeśli rejestracja się powiedzie, ustaw stan jako zalogowany
      setIsLogged(true);
      setShowModal(0); // Zamknij modal po zalogowaniu
      
    } catch (error) {
      console.error('Błąd rejestracji:', error);
      // Możesz wyświetlić komunikat o błędzie w modalu
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
      handleRejestrujClick();
    }
  };

  const handleTwojeClick = () => {
    if (isLogged) {
      navigate("/ZarzadzajZbiorkami.jsx");
    } else {
      handleLogujWylogujClick();
    }
  };

  const collections = [
    {
      title: "Nowi rodzice dla Batmana",
      image: batman4k,
      description:
        "Pilnie potrzebuję 2mln zł na piwo dla Twojego starego pijanego. Pomóż bla bla bla Pomóż bla bla blaPomóż bla bla blaPomóż bla bla blaPomóż bla bla bla ",
      funds: "5000 PLN",
      bank: "12345678910",
    },
    {
      title: "Zbiórka na szkołę",
      image: joker,
      description: "Pomóż dzieciom w potrzebie uzyskać amunicję.",
      funds: "12000 PLN",
      bank: "12345678910",
    },
    {
      title: "Wsparcie dla lokalnych firm",
      image: homelander,
      description: "Pomóż lokalnym przedsiębiorcom przetrwać trudne czasy",
      funds: "8000 PLN",
      bank: "12345678910",
    },
  ];

  return (
    <div className={`all-main-page ${showModal!=0 ? "modal-active" : ""}`}>
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
              <p className="collection-title">{collection.title}</p>
              <img
                src={collection.image}
                className="collection-image"
                alt="zdjecie"
              />
              <p className="collection-description">{collection.description}</p>
              <p className="collection-funds">
                Zbierane pieniądze: {collection.funds}
              </p>
            </div>
          </div>
        ))}
      </div>

      {showModal==1 && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div className="modal">
            <h2>{"Logowanie"}</h2>
            <TextField label="Email" variant="outlined" size="small" margin="normal" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <TextField label="Hasło" variant="outlined" size="small" margin="normal" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <button onClick={handleLogujZalogujClick}> Zaloguj się </button>
          </div>
        </div>
      )}

      {showModal==2 && (
          <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal">
              <h2>{"Rejestracja"}</h2>
              <TextField label="Imię i nazwisko" margin="normal" size="small" variant="outlined" value={fullName} onChange={(e) => setFullNameRegister(e.target.value)}/>
              <TextField label="Email" variant="outlined" size="small" margin="normal" value={emailRegister} onChange={(e) => setEmailRegister(e.target.value)}/>
              <TextField label="Hasło" variant="outlined" size="small" margin="normal" value={passwordRegister} onChange={(e) => setPasswordRegister(e.target.value)}/>
              <TextField label="Powtórz hasło" margin="normal" size="small" variant="outlined" value={passwordRepeat} onChange={(e) => setPasswordRepeat(e.target.value)}/>
              
              <button onClick={handleRejestrujZarejestrujClick}> Zarejestruj się</button>
            </div>
          </div>
        )
      }

      {/* <footer>All rights reserved.</footer> */}
    </div>
  );
}

export default MainPage;
