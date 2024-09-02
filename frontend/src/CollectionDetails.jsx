import "./styles/ZbiorkaSzczegoly.css";
import { useNavigate, useLocation } from "react-router-dom";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
// import copyicon from "./assets/copy-icon.png";

function CollectionDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { collection } = location.state || {}; // Pobranie danych z state

  // const handleCopyKontoClick = (bank) => {
  //   navigator.clipboard.writeText(bank);
  // };

  // const handleCopyKtoClick = (kto) => {
  //   navigator.clipboard.writeText(kto);
  // };

  const handlePowrotClick = () => {
    navigate("/");
  };

  const handleWesprzyjClick = () => {
    // Implement support functionality here
  };

  const handleUdostepnnijClick = () => {
    // Implement share functionality here
  };

  const calculateProgress = (collection) => {
    console.log(collection.collectionCollectedAmount);
    return (
      (collection.collectionCollectedAmount / collection.collectionAmount) * 100
    );
  };

  return (
    <div className="szczegoly-main">
      <div className="gorne-buttony4">
        <h1>{collection.collectionGoal}</h1>
      </div>
      <div className="left-container">
        <h1>{collection.title}</h1>
        <img
          className="image-to-show"
          src={`data:image/jpeg;base64,${collection.images[0].imageData}`}
          alt={collection.title}
        />
        <p>{collection.description}</p>
        <p>Zbierana kwota: {collection.collectionAmount}</p>
        {/* <p>
          Dla: <b>Marzena Rogalska</b>
          <button
            className="copy-button-kto"
            onClick={() => handleCopyKtoClick("Marzena Rogalska")}
          >
            <img src={copyicon} alt="copy-icon" />
          </button>
        </p> */}
        {/* <p className="collection-bank-x">
          Numer konta do wpłaty: <b>{collection.accountNumber}</b>
          <button
            className="copy-button-"
            onClick={() => handleCopyKontoClick(collection.accountNumber)}
          >
            <img src={copyicon} alt="copy-icon" />
          </button>
        </p> */}
      </div>

      <div className="right-container9">
        <p className="collection-funds">
          {0} z {collection.collectionAmount} zł
        </p>
        <Box sx={{ width: "100%", margin: "auto", marginBottom: "30px" }}>
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
        <button
          className="wesprzyj-teraz-button"
          onClick={() => handleWesprzyjClick(collection.accountNumber)}
        >
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
