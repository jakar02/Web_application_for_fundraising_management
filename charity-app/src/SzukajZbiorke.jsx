import "./StworzSzukajZbiorke.css";
import { useState } from "react";

function MyForm() {
  function handleAnulujClick() {
    window.location.href = "./";
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

  return (
    <div className="szukaj-zbiorke-all">
      <label htmlFor="szukaj-input" className="szukaj-font">
        <b>Szukaj zbiórki po celu i opisie</b>
      </label>
      <input
        type="text"
        placeholder="np. nowe buty"
        className="szukaj-input"
      ></input>
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
      <label htmlFor="lokalizacja-input" className="lokalizacja-font">
        <b>Lokalizacja</b>
      </label>
      <input
        type="text"
        placeholder="np. Kraków"
        className="lokalizacja-input"
      ></input>

      <div className="button-container">
        <button className="button-anuluj" onClick={handleAnulujClick}>Anuluj ✖</button>
        <button className="button-szukaj-po-celu">Szukaj 🔍︎</button>
        
      </div>
    </div>
  );
}

export default MyForm;
