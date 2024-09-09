import { useState } from "react";
import "../styles/CollectionDetails.css";
import { useNavigate, useLocation } from "react-router-dom";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

function CollectionDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { collection } = location.state || {}; // Pobranie danych z state

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

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
    return (
      (collection.collectionCollectedAmount / collection.collectionAmount) * 100
    );
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <div className="szczegoly-main">
      <div className="gorne-buttony4">
        <h1>{collection.collectionGoal}</h1>
      </div>
      <div className="left-container">
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <img
              className="image-to-show"
              src={`data:image/jpeg;base64,${collection.images[0].imageData}`}
              alt={collection.title}
              style={{ width: "100%", borderRadius: "8px" }}
            />
          </Grid>
          <Grid item xs={4}>
            <Grid container direction="column" spacing={2}>
              {collection.images.slice(1).map((image, index) => (
                <Grid item key={index}>
                  <img
                    src={`data:image/jpeg;base64,${image.imageData}`}
                    alt={`img-${index}`}
                    style={{
                      width: "100%",
                      cursor: "pointer",
                      borderRadius: "8px",
                    }}
                    onClick={() => handleImageClick(image)}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md">
          <DialogContent>
            <IconButton
              aria-label="close"
              onClick={handleCloseDialog}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
            {selectedImage && (
              <img
                src={`data:image/jpeg;base64,${selectedImage.imageData}`}
                alt="Selected"
                style={{ width: "100%", borderRadius: "8px" }}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="right-container9">
        <p className="collection-funds">
          {collection.collectionCollectedAmount} z {collection.collectionAmount} zł
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
          onClick={handleWesprzyjClick}
        >
          Wesprzyj teraz
        </button>
        <button className="udostpnij" onClick={handleUdostepnnijClick}>
          Udostępnij 🔗
        </button>
        <button className="wroc-button" onClick={handlePowrotClick}>
          Powrót
        </button>
      </div>
    </div>
  );
}

export default CollectionDetails;
