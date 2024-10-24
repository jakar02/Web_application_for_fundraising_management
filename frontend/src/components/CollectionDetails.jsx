import { useState, useEffect } from "react";
import "../styles/CollectionDetails.css";
import { useNavigate, useParams } from "react-router-dom";
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
import { TextField, Tooltip } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Helmet } from "react-helmet";
// import { QRCodeSVG } from "qrcode.react";
//import QRCode from 'qrcode-svg';

// import HomeIcon from "@mui/icons-material/Home";

function CollectionDetails() {
  //const token = localStorage.getItem("token");
  const navigate = useNavigate();
  //const location = useLocation();
  const { id } = useParams();
  // const { collection } = location.state || {}; // Pobranie danych z state
  // const [title, setTitle] = useState("");
  const [isActive, setIsActive] = useState(false);
  //const [description, setDescription] = useState("");
  // const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
  //   window.location.href
  // )}`;
  // const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
  //   window.location.href
  // )}&text=${encodeURIComponent("Wspieram zbiórkę "+ title)}`;

  // const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
  //   "Wspieraj zbiórkę: " +
  //     title +
  //     "! Sprawdź szczegóły: \n" +
  //     window.location.href
  // )}`;

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  // const [copySuccess, setCopySuccess] = useState(false);
  const [userFullName, setUserFullName] = useState("");
  const [collection, setCollection] = useState(null);

  const [showSupportModal, setShowSupportModal] = useState(false); // Nowy stan dla modal wsparcia
  const [amount, setAmount] = useState(10);

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

  const getCollection = async () => {
    try {
      const response = await axios.get("http://localhost:8081/collection", {
        params: { id: id },
      });

      setCollection(response.data);
      // setTitle(response.data.collectionGoal);
      setIsActive(response.data.active);
    } catch (error) {
      console.error("Błąd pobierania zbiorki", error);
    }
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
                  style={{ width: "97%", borderRadius: "7px" }}
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
    if (isActive) {
      setShowModal(true);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("share-modal-overlay")) {
      setShowModal(false);
      // setCopySuccess(false);
    }
  };

  const handleSupportOverlayClick = (e) => {
    if (e.target.classList.contains("support-modal-overlay")) {
      setShowSupportModal(false);
    }
  };

  // const copyLink = () => {
  //   navigator.clipboard.writeText(window.location.href);
  //   setCopySuccess(true);
  // };

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

    console.log("ResponseQR:", responseQR);

    if (typeof responseQR === "string" && responseQR.startsWith("data:image/")) {
      console.log("responseQR is a Base64 image string.");
  
      // Usuń nagłówek Base64 (np. "data:image/jpeg;base64," lub "data:image/png;base64,")
      const qrImageData = responseQR.replace(/^data:image\/[^;]+;base64,/, '');
  
      // Sprawdź, czy to JPEG lub PNG
      let qrImage;
      if (responseQR.startsWith("data:image/jpeg")) {
        const qrImageBytes = Uint8Array.from(atob(qrImageData), (c) => c.charCodeAt(0));
        qrImage = await pdfDoc.embedJpg(qrImageBytes);
      } else if (responseQR.startsWith("data:image/png")) {
        const qrImageBytes = Uint8Array.from(atob(qrImageData), (c) => c.charCodeAt(0));
        qrImage = await pdfDoc.embedPng(qrImageBytes);
      } else {
        console.error("Unsupported image format.");
        return;
      }
  
      // Ustal rozmiary obrazu (np. 300x300)
      const qrWidth = 150;
      const qrHeight = 150;
  
      // Narysuj obrazek QR na stronie PDF (np. centrowanie na stronie)
      page.drawImage(qrImage, {
        x: 600 / 2 - qrWidth / 2, // centrowanie w poziomie
        y: 180 - qrHeight, // pozycja powyżej tekstu opisu
        width: qrWidth,
        height: qrHeight,
      });
    } else {
      console.error("responseQR is not a valid Base64 image string.");
    }





    const amountText = amount + " zł";
    const amountFontSize = 12;
    const amountWidth = customFont.widthOfTextAtSize(amountText, amountFontSize);
    const amountX = (pageWidth - amountWidth) / 2; 
    const amountY = 30; 
    
    page.drawText("Zeskanuj kod QR w aplikacji bankowej:", {
      x: 20,
      y: amountY+75, // Pozycja na dole strony
      size: amountFontSize,
      font: customFont,
      color: rgb(0, 0, 0),
      maxWidth: 560,
      lineHeight: 14,
    });

    page.drawText(amountText, {
      x: amountX,
      y: amountY, 
      size: amountFontSize,
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
      });
      setUserFullName(response.data);
    } catch (error) {
      console.error("Błąd pobierania nazwy usera tworzącego zbiórkę:", error);
    }
  };

  const [responseQR, setResponseQR] = useState();

  const generateQrCode = async (inputAmount) => {
    if (isNaN(inputAmount) || inputAmount <= 0) {
      console.log("Nieprawidłowa kwota");
      return "";
    }
    console.log("Generuję kod QR dla kwoty:", inputAmount);
    try {
      const response = await axios.get("http://localhost:8081/generate-qr", {
        params: {
          name: "Jakub Karaś",
          ibanWithoutPL: "32102028920000510209352958",
          amount: inputAmount,
          unstructuredReference: collection.id,
          information: collection.collectionGoal,
        },
        responseType: "text", // Ensuring we expect a text-based response
      });
      // Directly setting the Base64 image in state
      setResponseQR(response.data);
    } catch (error) {
      console.error("Błąd generowania kodu QR:", error);
    }
  };

  const handleSupportClick = () => {
    if (isActive) {
      setShowSupportModal(true); 
      generateQrCode(10);
    }
  };


  const handleSupportAmountChange = (e) => {
    const inputAmount = Math.floor(e.target.value); 


    if (inputAmount < 1) {
      setAmount(1);
    } else {
      console.log("Ustawiam kwotę na:", inputAmount);
      setAmount(inputAmount);
    }

    generateQrCode(inputAmount);
  };

  const [copyMessage, setCopyMessage] = useState("");

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopyMessage("Skopiowano!");
    setTimeout(() => setCopyMessage(""), 2000); // Resetuje wiadomość po 2 sekundach
  };

  useEffect(() => {
    getCollection();
  }, []);


  useEffect(() => {
    if (collection) {
      getCollectionCreator();
      generateQrCode(10);
    }
  }, [collection]);

  return (
    <div className={`szczegoly-main`}>
      <Helmet>
        <meta
          property="og:title"
          content={collection ? collection.collectionGoal : "Zbiórka"}
        />
        <meta
          property="og:description"
          content={
            collection ? collection.collectionDescription : "Wsparcie zbiórki"
          }
        />
        <meta
          property="og:image"
          content={
            collection ? collection.collectionImageUrl : "domyślny-obrazek.jpg"
          }
        />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="gorne-buttony4">
        <h1>{collection ? collection.collectionGoal : "Loading..."}</h1>
      </div>
      {/* Wyświetlenie napisu "Zbiórka jest nieaktywna" nad ramką */}
      {collection && !isActive && (
        <div className="inactive-message">
          <h3>Zbiórka jest nieaktywna</h3>
        </div>
      )}
      {collection ? manageImagesGrid() : <p>Loading...</p>}
      {/* Check if collection is available */}
      <div className="right-container09">
        {collection ? (
          <>
            <div className="collection-fundsWithCity2">
              {collection.collectionCollectedAmount} z{" "}
              {collection.collectionAmount} zł
            </div>
            <Box sx={{ width: "100%", margin: "auto", marginBottom: "30px" }}>
              <LinearProgress
                variant="determinate"
                value={calculateProgress(collection)}
                sx={{
                  height: "10px",
                  backgroundColor: "#d3d3d3",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "rgb(20, 131, 20)",
                  },
                  borderRadius: "6px",
                }}
              />
            </Box>
            <button
              className={
                isActive
                  ? "wesprzyj-teraz-button"
                  : "wesprzyj-teraz-button-disabled"
              }
              onClick={handleSupportClick}
            >
              Wesprzyj teraz
            </button>
            <button
              className={isActive ? "udostpnij" : "udostpnij-disabled"}
              onClick={handleShareCollectionClick}
            >
              Pobierz
            </button>
            <button className="wroc-button" onClick={handlePowrotClick}>
              Powrót
            </button>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      {showModal && (
        <div className="share-modal-overlay" onClick={handleOverlayClick}>
          <div className="share-modal-content">
            <h2>Pobierz plakat A4</h2>
            <p>Wydrukuj plakat i przypnij do słupa reklamowego lub tablicy </p>
            <hr className="share-divider" />
            <div className="share-buttons">
              {/* <button
                className="share-button"
                onClick={() => window.open(facebookShareUrl, "_blank")}
              >
                Facebook
              </button> */}
              {/* <button
                className="share-button"
                onClick={() => window.open(twitterShareUrl, "_blank")}
              >
                Twitter
              </button> */}
              {/* <button className="share-button" onClick={copyLink}>
                {!copySuccess ? "Kopiuj link" : "Skopiowano"}
              </button> */}
              <button className="share-button" onClick={downloadPdf}>
                Pobierz PDF
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal wsparcia */}
      {showSupportModal && (
        <div
          className="support-modal-overlay"
          onClick={handleSupportOverlayClick} // Zamyka modal przy kliknięciu na overlay
        >
          <div className="support-modal">
            {/* Nagłówki h4 i formularze wyśrodkowane do lewej */}
            <h4 style={{ textAlign: "left" }}>
              1. Wpisz kwotę i zeskanuj kod QR w aplikacji bankowej
            </h4>
            <div className="qr-code">
              {responseQR && (
                <div>
                  <img
                    src={responseQR}
                    alt="QR Code"
                    style={{ width: "200px", height: "200px" }}
                  />
                </div>
              )}
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "200px",
                  marginBottom: "10px",
                }}
              >
                <input
                  type="number"
                  value={amount}
                  onChange={handleSupportAmountChange}
                  placeholder="Kwota wsparcia"
                  min="1"
                  step="1"
                  style={{
                    width: "100%",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    right: "34px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: "16px",
                    color: "gray",
                    pointerEvents: "none",
                  }}
                >
                  zł
                </span>
              </div>
            </div>

            {/* Sekcja przelewu bankowego */}
            <h4 style={{ textAlign: "left" }}>2. Przelew bankowy</h4>

            {/* Numer konta */}
            <Grid
              container
              spacing={2}
              alignItems="center"
              style={{ marginBottom: "10px" }}
            >
              <Grid item xs={9}>
                <TextField
                  label="Numer konta"
                  value="32 1020 2892 0000 5102 0935 2958"
                  InputProps={{
                    readOnly: true,
                  }}
                  fullWidth
                  variant="outlined"
                  style={{ paddingRight: "8px" }} // Dodać odstęp wokół etykiety
                />
              </Grid>
              <Grid item xs={3}>
                <Tooltip title="Kopiuj numer konta">
                  <IconButton
                    onClick={() =>
                      handleCopy("32 1020 2892 0000 5102 0935 2958")
                    }
                  >
                    <ContentCopyIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>

            {/* Tytuł przelewu */}
            <Grid
              container
              spacing={2}
              alignItems="center"
              style={{ marginBottom: "10px" }}
            >
              <Grid item xs={9}>
                <TextField
                  label="Tytuł przelewu (id zbiórki)"
                  value={collection.id}
                  InputProps={{
                    readOnly: true,
                  }}
                  fullWidth
                  variant="outlined"
                  style={{ paddingRight: "8px" }}
                />
              </Grid>
              <Grid item xs={3}>
                <Tooltip title="Kopiuj tytuł przelewu">
                  <IconButton
                    onClick={() => handleCopy(collection.collectionGoal)}
                  >
                    <ContentCopyIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>

            {/* Odbiorca */}
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={9}>
                <TextField
                  label="Odbiorca"
                  value="Jakub Karaś"
                  InputProps={{
                    readOnly: true,
                  }}
                  fullWidth
                  variant="outlined"
                  style={{ paddingRight: "8px" }}
                />
              </Grid>
              <Grid item xs={3}>
                <Tooltip title="Kopiuj odbiorcę">
                  <IconButton onClick={() => handleCopy("Jakub Karaś")}>
                    <ContentCopyIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>

            {/* Wiadomość po skopiowaniu */}
            {copyMessage && <p style={{ color: "blue" }}>{copyMessage}</p>}
          </div>
        </div>
      )}
      );
    </div>
  );
}

export default CollectionDetails;
