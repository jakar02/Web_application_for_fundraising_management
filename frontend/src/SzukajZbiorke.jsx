import "./styles/StworzSzukajZbiorke.css";
import "./styles/SzukajZbiorke.css";
import "./styles/MainPage.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import batman4k from "./assets/batman4k.jpg";
import homelander from "./assets/homelander.jpg";
import joker from "./assets/joker.jpg";
import TextField from "@mui/material/TextField";

function MyForm() {
  const navigate = useNavigate();

  function handleAnulujClick() {
    navigate("/");
  }

  const [sportChecked, setSportChecked] = useState(false);
  const [zdrowieChecked, setZdrowieChecked] = useState(false);
  const [wojnaChecked, setWojnaChecked] = useState(false);
  const [katastrofyChecked, setKatastrofyChecked] = useState(false);
  const [pozostaleChecked, setPozostaleChecked] = useState(false);

  const handleSportCheckboxChange = (event) => {
    setSportChecked(event.target.checked);
  };

  const handleZdrowieCheckboxChange = (event) => {
    setZdrowieChecked(event.target.checked);
  };

  const handleWojnaCheckboxChange = (event) => {
    setWojnaChecked(event.target.checked);
  };

  const handleKatastrofyCheckboxChange = (event) => {
    setKatastrofyChecked(event.target.checked);
  };

  const handlePozostaleCheckboxChange = (event) => {
    setPozostaleChecked(event.target.checked);
  };

  const handleZbiorkaClick = (collection) => {
    navigate("/ZbiorkaSzczegoly.jsx", { state: { collection } });
  };

  const handleSzukajClick = () => {};

  const collections = [
    {
      title: "Nowi rodzice dla Batmana",
      image: batman4k,
      description:
        "Pilnie potrzebuję 2mln zł na piwo dla Twojego starego pijanego. Pomóż",
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
    <div>
      <h1 className="title-of-the-page">Szukaj zbiórkę</h1>
      <div className="page-container">
        <div className="left-column">
          <div className="main-page-grid2">
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
                  <p className="collection-description">
                    {collection.description}
                  </p>
                  <p className="collection-funds">
                    Zbierane pieniądze: {collection.funds}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="right-column">
          <div className="szukaj-zbiorke-all">
            <TextField
              label="Szukaj zbiórki po tytule i opisie"
              variant="outlined"
              size="normal"
              margin="normal"
              fullWidth
              sx={{ backgroundColor: "white", marginBottom: "10px" }}
            />

            <TextField
              label="Miasto"
              variant="outlined"
              size="normal"
              margin="normal"
              fullWidth
              sx={{ backgroundColor: "white", marginBottom: "10px" }}
            />

            {/* <label htmlFor="szukaj-input" className="szukaj-font">
              <b>Szukaj zbiórki po celu i opisie</b>
            </label>
            <input
              type="text"
              placeholder="np. nowe buty"
              className="szukaj-input"
            ></input> */}
            <p>
              <b>Wybierz kategorie:</b>
            </p>
            <form className="form-input">
              <input
                type="checkbox"
                id="sport"
                name="sport"
                value="sport"
                checked={sportChecked}
                onChange={handleSportCheckboxChange}
              />
              <label htmlFor="sport"> Sprzęt sportowy/spełnianie marzeń</label>
              <br />

              <input
                type="checkbox"
                id="zdrowie"
                name="zdrowie"
                value="zdrowie"
                checked={zdrowieChecked}
                onChange={handleZdrowieCheckboxChange}
              />
              <label htmlFor="zdrowie"> Operacja/leki/zdrowie</label>
              <br />

              <input
                type="checkbox"
                id="wojna"
                name="wojna"
                value="wojna"
                checked={wojnaChecked}
                onChange={handleWojnaCheckboxChange}
              />
              <label htmlFor="wojna"> Wojna</label>
              <br />

              <input
                type="checkbox"
                id="katastrofy"
                name="katastrofy"
                value="katastrofy"
                checked={katastrofyChecked}
                onChange={handleKatastrofyCheckboxChange}
              />
              <label htmlFor="katastrofy">
                {" "}
                Katastrofy naturalne/pożary/powodzie
              </label>
              <br />

              <input
                type="checkbox"
                id="pozostale"
                name="pozostale"
                value="pozostale"
                checked={pozostaleChecked}
                onChange={handlePozostaleCheckboxChange}
              />
              <label htmlFor="pozostale"> Pozostale</label>
              <br />
            </form>
            {/* <label htmlFor="lokalizacja-input" className="lokalizacja-font">
              <b>Lokalizacja</b>
            </label>
            <input
              type="text"
              placeholder="np. Kraków"
              className="lokalizacja-input"
            ></input> */}

            <div className="button-container">
              <button className="button-anuluj" onClick={handleAnulujClick}>
                Anuluj ✖
              </button>
              <button
                className="button-szukaj-po-celu"
                onClick={handleSzukajClick}
              >
                Szukaj 🔍︎
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyForm;
