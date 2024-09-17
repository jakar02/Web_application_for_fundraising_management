import { useState, useEffect } from "react";
import "../styles/CollectionDetails.css";
import { useNavigate, useLocation } from "react-router-dom";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { PDFDocument, rgb } from "pdf-lib"; // Importujemy pdf-lib
import abhayaLibre from "../assets/abhaya-libre/AbhayaLibre-Regular.ttf";
import fontkit from "@pdf-lib/fontkit";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import axios from "axios";
// import HomeIcon from "@mui/icons-material/Home";

function CollectionDetails() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();
  const { collection } = location.state || {}; // Pobranie danych z state
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    window.location.href
  )}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
    window.location.href
  )}&text=${encodeURIComponent("Wspieram zbiórkę!")}`;

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [userFullName, setUserFullName] = useState("");

  const handlePowrotClick = () => {
    navigate("/");
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

  const manageImagesGrid = () => {
    if (collection.images.length > 1) {
      return (
        <div className="left-container9">
          <Grid container spacing={0}>
            <Grid item xs={8.9}>
              <img
                className="image-to-show"
                src={`data:image/jpeg;base64,${collection.images[0].imageData}`}
                alt={collection.title}
                style={{
                  width: "100%",
                  borderRadius: "8px",
                  marginLeft: "50px",
                  marginTop: "60px",
                  marginRight: "40px",
                }}
              />
            </Grid>
            <Grid item xs={2.5}>
              <Grid
                container
                direction="column"
                spacing={0}
                sx={{ marginTop: "60px", marginRight: "30px" }}
              >
                {collection.images.slice(1).map((image, index) => (
                  <Grid item key={index}>
                    <img
                      src={`data:image/jpeg;base64,${image.imageData}`}
                      alt={`img-${index}`}
                      style={{
                        width: "100%",
                        cursor: "pointer",
                        borderRadius: "7px",
                        marginTop: "0px",
                        marginRight: "30px",
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
                  style={{ width: "100%", borderRadius: "7px" }}
                />
              )}
            </DialogContent>
          </Dialog>

          <div className="collection-authorWithCity">
            <PersonIcon
              sx={{
                fontSize: 18,
                marginRight: "2px",
                color: "gray",
                position: "relative",
                top: "3px",
              }}
            />
            {userFullName}
            <LocationOnIcon
              sx={{
                fontSize: 18,
                marginLeft: "10px",
                marginRight: "2px",
                color: "gray",
                position: "relative",
                top: "2px",
              }}
            />
            {collection.city}
          </div>
          <p className="collection-description9">{collection.description}</p>
        </div>
      );
    }
    if (collection.images.length === 1) {
      return (
        <div className="left-container9">
          <img
            className="image-to-show"
            src={`data:image/jpeg;base64,${collection.images[0].imageData}`}
            alt={collection.title}
            style={{
              width: "100%",
              borderRadius: "7px",
              marginLeft: "50px",
              marginTop: "60px",
              marginRight: "25px",
            }}
          />
          <div className="collection-authorWithCity">
            <PersonIcon
              sx={{
                fontSize: 18,
                marginRight: "2px",
                color: "gray",
                position: "relative",
                top: "2px",
              }}
            />
            {userFullName}
            <LocationOnIcon
              sx={{
                fontSize: 18,
                marginLeft: "10px",
                marginRight: "2px",
                color: "gray",
                position: "relative",
                top: "2px",
              }}
            />
            {collection.city}
          </div>
          <p className="collection-description">{collection.description}</p>
        </div>
      );
    } else {
      return (
        <div className="left-container9">
          <img
            className="image-to-show"
            src={`data:image/jpeg;base64,${collection.images[0].imageData}`}
            alt={collection.title}
            style={{
              width: "100%",
              borderRadius: "8px",
              marginLeft: "30px",
              marginTop: "60px",
              marginRight: "0px",
            }}
          />
          <p className="collection-description">{collection.description}</p>
        </div>
      );
    }
  };

  const handleShareCollectionClick = () => {
    setShowModal(true);
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("share-modal-overlay")) {
      setShowModal(false);
      setCopySuccess(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopySuccess(true);
  };

  const downloadPdf = async () => {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);
    const customFontBytes = await fetch(abhayaLibre).then((res) =>
      res.arrayBuffer()
    );
    const customFont = await pdfDoc.embedFont(customFontBytes);
    const page = pdfDoc.addPage([600, 800]);

    // Embed the JPEG image
    const imageData = collection.images[0].imageData;
    const imageBytes = Uint8Array.from(atob(imageData), (c) => c.charCodeAt(0));
    const image = await pdfDoc.embedJpg(imageBytes);

    // Get image dimensions and maintain the aspect ratio
    const imageWidth = 560; // Fixed width for the image
    const imageHeight = (image.height / image.width) * imageWidth;

    // Draw the image with the calculated height to maintain aspect ratio
    page.drawImage(image, {
      x: 600 / 2 - imageWidth / 2, // Center the image on the page
      y: 800 - imageHeight - 70, // Position it above the description text
      width: imageWidth,
      height: imageHeight,
    });

    // Calculate text width and position to center it
    const titleText = collection.collectionGoal;
    const titleFontSize = 30;
    const titleWidth = customFont.widthOfTextAtSize(titleText, titleFontSize);
    const pageWidth = 600; // Page width
    const titleX = (pageWidth - titleWidth) / 2; // Center horizontally
    const titleY = 800 - 40; // Position the title vertically

    // Draw the title text
    page.drawText(titleText, {
      x: titleX,
      y: titleY,
      size: titleFontSize,
      font: customFont,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Zbierana kwota: ${collection.collectionAmount} zł`, {
      x: 20,
      y: 800 - imageHeight - 110,
      size: 16,
      font: customFont,
      color: rgb(0, 0, 0),
    });
    // Adjust text position based on the image's position and size
    page.drawText(collection.description, {
      x: 20,
      y: 800 - imageHeight - 140, // Position the text below the image
      size: 12,
      font: customFont,
      color: rgb(0, 0, 0),
      maxWidth: 560,
      lineHeight: 14,
    });

    // Zapisz dokument PDF jako byte array
    const pdfBytes = await pdfDoc.save();

    // Utwórz link do pobrania
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = collection.collectionGoal + ".pdf";

    // Kliknij link, aby pobrać plik
    link.click();

    // Usuń link po pobraniu
    URL.revokeObjectURL(link.href);
  };

  const getCollectionCreator = async () => {
    try {
      const response = await axios.get("http://localhost:8081/userFullName", {
        params: { id: collection.id },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserFullName(response.data);
    } catch (error) {
      console.error("Błąd pobierania nazwy usera tworzącego zbiórkę:", error);
    }
  };

  useEffect(() => {
    getCollectionCreator();
  }, []);

  return (
    <div className={`szczegoly-main`}>
      <div className="gorne-buttony4">
        {/* <div className="home-button"
          style={{
            display: "flex",
            justifyContent: "flex-start",
            padding: "10px",
          }}
        >
          <IconButton onClick={handlePowrotClick} sx={{ color: "white" }}>
            <HomeIcon />
          </IconButton>
        </div> */}
        <h1>{collection.collectionGoal}</h1>
      </div>

      {manageImagesGrid()}

      <div className="right-container9">
        <div className="collection-fundsWithCity2">
          {0} z {collection.collectionAmount} zł
          {/* <LocationOnIcon
            sx={{ fontSize: 18, marginRight: "2px", color: "gray" }} // Zmniejszony odstęp
          />
          {collection.city} */}
        </div>
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

        {/* <p className="collection-date">
          Data zakończenia: {collection.collectionEndDate}
        </p> */}
        <button className="wesprzyj-teraz-button">Wesprzyj teraz</button>
        <button className="udostpnij" onClick={handleShareCollectionClick}>
          Udostępnij 🔗
        </button>
        <button className="wroc-button" onClick={handlePowrotClick}>
          Powrót
        </button>
      </div>

      {showModal && (
        <div className="share-modal-overlay" onClick={handleOverlayClick}>
          <div className="share-modal-content">
            <h2>Udostępnij zbiórkę</h2>
            <p>Udostępnianie zbiórki zyskują o wiele więcej wpłat</p>
            <hr className="share-divider" />
            <div className="share-buttons">
              <button
                className="share-button"
                onClick={() => window.open(facebookShareUrl, "_blank")}
              >
                Facebook
              </button>
              <button
                className="share-button"
                onClick={() => window.open(twitterShareUrl, "_blank")}
              >
                Twitter
              </button>
              <button className="share-button" onClick={copyLink}>
                {!copySuccess ? "Kopiuj link" : "Skopiowano"}
              </button>
              <button className="share-button" onClick={downloadPdf}>
                Pobierz PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CollectionDetails;
