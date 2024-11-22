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
  const [authenticated, setAuthenticated] = useState(false);

  function handleBackClick() {
    navigate("/");
  }

  const [collectionSelected, setCollectionSelected] = useState(null);

  const handleCollectionClick = (collection) => {
    setCollectionSelected(collection);
  };

  const handleCollectionDoubleClick = (collection) => {
    navigate(`/CollectionDetails/${collection.id}`, { state: { collection } });
  };

  const handleEditClick = () => {
    if (collectionSelected != null) {
      if (!collectionSelected.active) {
        alert("Nie można edytować zakończonej zbiórki!");
      } else {
        navigate("/CreateCollection", {
          state: { sendCollection: collectionSelected },
        });
      }
    }
  };

  const authenticatePage = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8081/auth/api/authorize",
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Autoryzacja:", response.data);
      if (response.data.status != true) {
        navigate("/");
      }
      setAuthenticated(true);
    } catch (error) {
      console.error("Błąd autoryzacji strony:", error);
      navigate("/");
    }
  };

  const handleFinishClick = async () => {
    if (collectionSelected != null) {
      try {
        await axios.post(
          "http://localhost:8081/auth/api/user_collection_end",
          null,
          {
            params: { id: collectionSelected.id },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        console.error("Błąd zakończenia zbiórki:", error);
      }
      setCollectionSelected(null);
      showCollections();
    }
  };

  const showCollections = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/auth/api/user_collections",
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

  const handleTwitterPostClick = async () => {
    console.log("Próba");
    if (collectionSelected === null || collectionSelected.active === false) {
      alert("Nie można publikować zakończonej zbiórki!");
      return;
    } else if (collectionSelected.postedOnTwitter === true) {
      alert("Zbiórka została już opublikowana na Twitterze!");
      return;
    } else {
      try {
        const response = await axios.post(
          "http://localhost:8081/auth/api/twitter/tweet",
          null,
          {
            params: { id: collectionSelected.id },
            headers: {
              Authorization: `Bearer ${token}`,
            }, 
          }
        );
        alert("Zbiórka została opublikowana na Twitterze!");
        console.log(response.data);
      } catch (error) {
        console.error("Błąd udostępniania na Twitterze:", error);
      }
    }
  };

  useEffect(() => {
    authenticatePage();
  }, []);

  useEffect(() => {
    showCollections();
  }, [authenticated]);

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
                  onClick={() => handleCollectionClick(collection)}
                  onDoubleClick={() => handleCollectionDoubleClick(collection)}
                  key={index}
                >
                  <div
                    className={
                      collectionSelected !== collection
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
                        {collection.collectionCollectedAmount} z{" "}
                        {collection.collectionAmount} zł
                      </p>
                      <p className="collection-city">
                        <LocationOnIcon
                          sx={{
                            fontSize: 18,
                            marginRight: "2px",
                            color: "gray",
                          }} // Zmniejszony odstęp
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
              {collectionSelected != null
                ? `Wybrano: ${collectionSelected.collectionGoal}`
                : "Wybierz zbiórkę"}
            </p>
            <div className="button-container-3">
              <button
                className={
                  collectionSelected != null && collectionSelected.active
                    ? "button-edytuj3"
                    : "button-edytuj3-disabled"
                }
                onClick={handleEditClick}
              >
                Edytuj
              </button>

              <button
                className={
                  collectionSelected != null &&
                  !collectionSelected.postedOnTwitter &&
                  collectionSelected.active
                    ? "button-twitter3"
                    : "button-twitter3-disabled"
                }
                onClick={handleTwitterPostClick}
              >
                Opublikuj na Twitterze
              </button>

              <button className={(collectionSelected != null && collectionSelected.active) ? "button-zakoncz3" : "button-zakoncz3-disabled"} onClick={handleFinishClick}>
                Zakończ zbiórkę
              </button>
              <button className="button-anuluj3" onClick={handleBackClick}>
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
