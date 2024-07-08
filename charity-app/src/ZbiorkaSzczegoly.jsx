
import "./ZbiorkaSzczegoly.css"
import { useLocation } from "react-router-dom";
import copyicon from "./assets/copy-icon.png";

function ZbiorkaSzczegoly() {
  const location = useLocation();
  const { collection } = location.state;

  const handleCopyClick = (bank) => {
    navigator.clipboard.writeText(bank).then(() => {
      alert("Numer konta skopiowany do schowka!");
    });
  };

  return (
    <div className="szczegoly-main">
      <h1>{collection.title}</h1>
      <img className="image-to-show" src={collection.image} alt={collection.title} />
      <p>{collection.description}</p>
      <p>Zbierane pieniądze: {collection.funds}</p>
      <p className="collection-bank">Numer konta do wpłaty: {collection.bank}</p>
              <button className="copy-button" onClick={() => handleCopyClick(collection.bank)}>
                <img src={copyicon} alt="copy-icon" />
              </button>
    </div>
  );
}

export default ZbiorkaSzczegoly;
