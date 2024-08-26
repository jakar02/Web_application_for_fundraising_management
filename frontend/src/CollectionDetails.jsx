import "./styles/ZbiorkaSzczegoly.css";
import { useNavigate, useLocation } from "react-router-dom";
import copyicon from "./assets/copy-icon.png";

function CollectionDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { collection } = location.state || {}; // Pobranie danych z state

  const handleCopyKontoClick = (bank) => {
    navigator.clipboard.writeText(bank);
  };

  const handleCopyKtoClick = (kto) => {
    navigator.clipboard.writeText(kto);
  };

  const handlePowrotClick = () => {
    navigate("/");
  }

  const handleWesprzyjClick = () => {
    // Implement support functionality here
  };

  const handleUdostepnnijClick = () => {
    // Implement share functionality here
  };

  return (
    <div className="szczegoly-main">
      <div className="left-container">
        <h1>{collection.title}</h1>
        <img className="image-to-show" src={`data:image/jpeg;base64,${collection.images[0].imageData}`} alt={collection.title} />
        <p>{collection.description}</p>
        <p>Zbierana kwota: {collection.collectionAmount}</p>
        <p>
          Dla: <b>Marzena Rogalska</b>
          <button className="copy-button-kto" onClick={() => handleCopyKtoClick("Marzena Rogalska")}>
            <img src={copyicon} alt="copy-icon" />
          </button>
        </p>
        <p className="collection-bank-x">
          Numer konta do wpłaty: <b>{collection.accountNumber}</b>
          <button className="copy-button-" onClick={() => handleCopyKontoClick(collection.accountNumber)}>
            <img src={copyicon} alt="copy-icon" />
          </button>
        </p>
      </div>

      <div className="right-container">
        <button className="wesprzyj-teraz-button" onClick={() => handleWesprzyjClick(collection.accountNumber)}>
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

export default CollectionDetails;
