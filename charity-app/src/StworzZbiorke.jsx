import "./StworzSzukajZbiorke.css";
import { useNavigate } from "react-router-dom";

function StworzZbiorke() {
  const navigate = useNavigate();

  function handleAnulujClick() {
    navigate("/");
    // window.location.href = "./";
  }

  function handleDalejClick() {
    navigate("/StworzZbiorkeNext.jsx");
    // window.location.href = "./StworzZbiorkeNext.jsx";
  }



  return (
    <div className="stworz-zbiorke-all">
      <label htmlFor="cel-input" className="cel-font">
        <b>Cel zbiórki</b>
      </label>
      <input
        id="cel-input"
        type="text"
        placeholder="Bilet na hawaje"
        className="cel-input"
      />

      <label htmlFor="kwota-input" className="kwota-font">
        <b>Kwota</b>
      </label>
      <input
        id="kwota-input"
        type="text"
        placeholder="0,00 PLN"
        className="kwota-input"
      />

      <div className="button-container">
        <button className="button-anuluj" onClick={handleAnulujClick}>
          Anuluj ✖
        </button>
        <button className="button-dalej" onClick={handleDalejClick}>
          Dalej→
        </button>
      </div>
      
      <p className="page-info">Strona 1/2</p>
    </div>
  );
}

export default StworzZbiorke;
