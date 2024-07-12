import { useState } from "react";
import "./ZarzadzajZbiorkami.css";
import { useNavigate } from "react-router-dom";
import batman4k from "./assets/batman4k.jpg";
import homelander from "./assets/homelander.jpg";
import joker from "./assets/joker.jpg";

function ZarzadzajZbiorkami() {
  const navigate = useNavigate();

  function handleAnulujClick() {
    navigate("/");
  }

  const [whichZbiorkaSelected, setWhichZbiorkaSelected] = useState(null);

  const handleZbiorkaClick = (collection) => {
    setWhichZbiorkaSelected(collection.title);
  };

  const handleZbiorkaDoubleClick = (collection) => {
    navigate("/ZbiorkaSzczegoly.jsx", { state: { collection } });
  };

  const handleEdytujClick = () => {
    if (whichZbiorkaSelected != null) {
      navigate("/StworzZbiorkeNext.jsx");
    }
  };

  const handleZakonczClick = () => {
    if (whichZbiorkaSelected != null) {
      console.log("Zakończono zbiórkę: " + whichZbiorkaSelected);
    }
  };

  const handleRaportClick = () => {
    if (whichZbiorkaSelected != null) {
      console.log("Wygenerowano raport dla zbiórki: " + whichZbiorkaSelected);
    }
  };

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
      <h1 className="title-of-the-page">Zarządzaj swoimi zbiórkami</h1>
      <div className="page-container2">
        <div className="content-container">
          <div className="left-column2">
            <div className="main-page-grid3">
              {collections.map((collection, index) => (
                <div
                  className="main-page-content"
                  onClick={() => handleZbiorkaClick(collection)}
                  onDoubleClick={() => handleZbiorkaDoubleClick(collection)}
                  key={index}
                >
                  <div
                    className={
                      whichZbiorkaSelected !== collection.title
                        ? "collection-frame2"
                        : "collection-frame2-selected"
                    }
                  >
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

          <div className="right-column2">
            <p className="collection-title2">
              {whichZbiorkaSelected != null
                ? whichZbiorkaSelected
                : "Wybierz zbiórkę"}
            </p>
            <div className="button-container-3">
              <button className="button-edytuj3" onClick={handleEdytujClick}>
                Edytuj
              </button>
              <button className="button-raport3" onClick={handleRaportClick}>
                Generuj raport
              </button>
              <button className="button-zakoncz3" onClick={handleZakonczClick}>
                Zakończ zbiórkę
              </button>
              <button className="button-anuluj3" onClick={handleAnulujClick}>
                Powrót
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ZarzadzajZbiorkami;
