import { useState, useEffect } from "react";
import "../styles/ManageYourCollections.css";
import { useNavigate } from "react-router-dom";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import axios from "axios";

function ManageCollections() {
  const navigate = useNavigate();
  const [collections, setCollections] = useState([]);
  const token = localStorage.getItem("token");

  function handleAnulujClick() {
    navigate("/");
  }

  const [whichZbiorkaSelected, setWhichZbiorkaSelected] = useState(null);

  const handleZbiorkaClick = (collection) => {
    setWhichZbiorkaSelected(collection);
  };

  const handleZbiorkaDoubleClick = (collection) => {
    navigate(`/CollectionDetails/${collection.id}`, { state: { collection } });
  };

  const handleEdytujClick = () => {
    if (whichZbiorkaSelected != null) {
      if (!whichZbiorkaSelected.active) {
        alert("Nie można edytować zakończonej zbiórki!");
      } else {
        navigate("/CreateCollection", {
          state: { sendCollection: whichZbiorkaSelected },
        });
      }
    }
  };

  const handleZakonczClick = async () => {
    if (whichZbiorkaSelected != null) {
      try {
        await axios.post(
          "http://localhost:8081/auth/api/user_collections_end",
          null,
          {
            params: { id: whichZbiorkaSelected.id },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        console.error("Błąd zakończenia zbiórki:", error);
      }
      setWhichZbiorkaSelected(null);
      showCollections();
    }
  };

  // const handleRaportClick = () => {
  //   if (whichZbiorkaSelected != null) {
  //     console.log("Wygenerowano raport dla zbiórki: " + whichZbiorkaSelected);
  //   }
  // };

  const showCollections = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/auth/api/user_collections_get",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const sortedCollections = response.data.sort((a, b) => {
        return a.active === b.active ? 0 : a.active ? -1 : 1;
      });
      setCollections(sortedCollections); // Zapisz posortowane zbiorki
    } catch (error) {
      console.error("Błąd pobierania zbiorek uzytkownika:", error);
    }
  };

  const calculateProgress = (collection) => {
    return (
      (collection.collectionCollectedAmount / collection.collectionAmount) * 100
    );
  };

  useEffect(() => {
    showCollections();
  }, []);

  return (
    <div>
      <h1 className="gorne-buttony2">Zarządzaj swoimi zbiórkami</h1>
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
                      whichZbiorkaSelected !== collection
                        ? "collection-frame2"
                        : "collection-frame2-selected"
                    }
                  >
                    <img
                      src={`data:image/jpeg;base64,${collection.images[0].imageData}`}
                      className="collection-image"
                      alt="zdjecie"
                    />
                    <p className="collection-title">
                      {collection.collectionGoal}
                    </p>
                    <p className="collection-description">
                      {collection.description}
                    </p>
                    <div className="collection-fundsWithCity">
                <p className="collection-funds">
                  {collection.collectionCollectedAmount} z {collection.collectionAmount} zł
                </p>
                <p className="collection-city">
                  <LocationOnIcon
                    sx={{ fontSize: 18, marginRight: "2px", color: "gray" }} // Zmniejszony odstęp
                  />
                  {collection.city}
                </p>
              </div>
                    <Box
                      sx={{
                        marginBottom: "50px",
                        marginLeft: "10px",
                        marginRight: "10px",
                      }}
                    >
                      <LinearProgress
                        variant="determinate"
                        value={calculateProgress(collection)}
                        sx={{
                          height: "10px",
                          backgroundColor: "#d3d3d3", // Tło paska (szary)
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: "rgb(20, 131, 20)",
                          },
                          borderRadius: "6px",
                        }}
                      />
                    </Box>
                    <p
                      className={
                        collection.active
                          ? "collection-active"
                          : "collection-notactive"
                      }
                    >
                      {collection.active ? "Aktywna" : "Zakończona"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="right-column2">
            <p className="collection-title2">
              {whichZbiorkaSelected != null
                ? `Wybrano: ${whichZbiorkaSelected.collectionGoal}`
                : "Wybierz zbiórkę"}
            </p>
            <div className="button-container-3">
              <button className="button-edytuj3" onClick={handleEdytujClick}>
                Edytuj
              </button>
              {/* <button className="button-raport3" onClick={handleRaportClick}>
                Generuj raport
              </button> */}
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

export default ManageCollections;
