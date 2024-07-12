import "./styles/MainPage.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import batman4k from "./assets/batman4k.jpg";
import homelander from "./assets/homelander.jpg";
import joker from "./assets/joker.jpg";

function MainPage() {
  const [showModal, setShowModal] = useState(false);
  const [isLogin, areYouLoggingIn] = useState(true);
  const navigate = useNavigate();

  const [isLogged, setIsLogged] = useState(true);

  const handleSzukajClick = () => {
    navigate("/SzukajZbiorke.jsx");
    // window.location.href = "./SzukajZbiorke.jsx";
  };

  const handleLogujWylogujClick = () => {
    if (isLogged) {
      setIsLogged(false);
    } else {
      areYouLoggingIn(true);
      setShowModal(true);
    }
  };

  const handleLogujZalogujClick = () => {
    setIsLogged(true);
    setShowModal(false);
  };

  const handleRejestrujClick = () => {
    areYouLoggingIn(false);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
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
    <div className={`all-main-page ${showModal ? "modal-active" : ""}`}>
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

      {showModal && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div className="modal">
            <h2>{isLogin ? "Logowanie" : "Rejestracja"}</h2>
            <input type="text" placeholder="Nazwa użytkownika" />
            <input type="password" placeholder="Hasło" />
            {!isLogin && <input type="password" placeholder="Powtórz hasło" />}
            {isLogin && (
              <button onClick={handleLogujZalogujClick}> Zaloguj się </button>
            )}
            {!isLogin && <button> Zarejestruj się </button>}
          </div>
        </div>
      )}

      {/* <footer>All rights reserved.</footer> */}
    </div>
  );
}

export default MainPage;
