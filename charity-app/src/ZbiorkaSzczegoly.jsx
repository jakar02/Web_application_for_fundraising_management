import "./ZbiorkaSzczegoly.css";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import copyicon from "./assets/copy-icon.png";

function ZbiorkaSzczegoly() {
  const navigate = useNavigate();
  const location = useLocation();
  const { collection } = location.state;

  const handleCopyKontoClick = (bank) => {
    navigator.clipboard.writeText(bank);
  };

  const handleCopyKtoClick = (kto) => {
    navigator.clipboard.writeText(kto);
  };

  const handlePowrotClick = () => {
    navigate("/");
  }

  const handleWesprzyjClick = (numerkonta) => {
    // Implement support functionality here
  };

  const handleUdostepnnijClick = () => {
    // Implement share functionality here
  };

  return (
    <div className="szczegoly-main">
      <div className="left-container">
        <h1>{collection.title}</h1>
        <img className="image-to-show" src={collection.image} alt={collection.title} />
        <p>{collection.description}</p>
        <p>Zbierana kwota: {collection.funds}</p>
        <p>
          Dla: <b>Marzena Rogalska</b>
          <button className="copy-button-kto" onClick={() => handleCopyKtoClick("Marzena Rogalska")}>
            <img src={copyicon} alt="copy-icon" />
          </button>
        </p>
        <p className="collection-bank-x">
          Numer konta do wpłaty: <b>{collection.bank}</b>
          <button className="copy-button-" onClick={() => handleCopyKontoClick(collection.bank)}>
            <img src={copyicon} alt="copy-icon" />
          </button>
        </p>
      </div>

      <div className="right-container">
        <button className="wesprzyj-teraz-button" onClick={() => handleWesprzyjClick(collection.bank)}>
          Wesprzyj teraz 
        </button>
        <button className="udostpnij" onClick={() => handleUdostepnnijClick()}>
          Udostępnij 🔗
        </button>
        <button className="wroc-button" onClick={() => handlePowrotClick()}>
          Powrót
        </button>
      </div>
    </div>
  );
}

export default ZbiorkaSzczegoly;
