import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Switch,
  Button,
  TextField,
  Tooltip,
  IconButton,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import Grid from "@mui/material/Grid";
import "../styles/CollectionState.css";
import axios from "axios";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

function CollectionState() {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [userFullName, setUserFullName] = useState("");
  const [collections, setCollections] = useState(null);
  const [order, setOrder] = useState("desc"); // Sortowanie rosnące/ malejące
  const [orderBy, setOrderBy] = useState("active"); // Domyślnie sortowanie po ID
  const token = localStorage.getItem("token");
  const [collection, setCollection] = useState(null);
  // Pobranie kolekcji z API
  const getAllCollections = async () => {
    try {
      const response = await axios.get("http://localhost:8081/auth/api/all_collections", {
        headers: {
          Authorization: `Bearer ${token}`} // Dodaj nagłówek autoryzacji
      });
      console.log("Poprawnie pobrano zbiorki:", response.data);
      setCollections(response.data);
    } catch (error) {
      console.error("Błąd pobierania zbiorek:", error);
    }
  };

  // Powrót do poprzedniej strony
  // function handlePreviousPageClick() {
  //   navigate("/");
  // }

  // Funkcja do sortowania
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Funkcja sortująca kolekcje
  const sortCollections = (collections, comparator) => {
    return collections.slice().sort(comparator);
  };

  const getComparator = (order, orderBy) => {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  const sortedCollections = collections
    ? sortCollections(collections, getComparator(order, orderBy))
    : [];

  // Funkcja do zakończenia zbiórki
  // Funkcja do obsługi zmiany stanu 'Aktywna' (Switch)
  const handleActiveChange = async (collectionId, active) => {
    try {
      // Wyślij żądanie do API, aby zaktualizować stan 'active'
      await axios.post(
        "http://localhost:8081/auth/api/user_collections_update_active",
        null,
        {
          params: { id: collectionId, newState: !active }, // Zmieniamy na odwrotny stan
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Po aktualizacji odświeżamy listę
      getAllCollections();
    } catch (error) {
      console.error("Błąd aktualizacji stanu aktywności:", error);
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
      if(response.data.status != true){
        navigate("/");
      }
      setAuthenticated(true);
    } catch (error) {
      console.error("Błąd autoryzacji strony:", error);
      navigate("/");
    }
  };

  const handleEditClick = (whichZbiorkaSelected) => {
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

  // Funkcja do obsługi zmiany stanu 'Przelano' (Switch)
  const handleTransferChange = async (collectionId, transferred, active) => {
    try {
      // Wyślij żądanie do API, aby zaktualizować stan 'transferred'
      await axios.post(
        "http://localhost:8081/auth/api/update_transferred",
        null,
        {
          params: { id: collectionId, newState: !transferred }, // Aktualizujemy odwrotnie
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Po aktualizacji odświeżamy listę
      getAllCollections();
      if(active === true){
        handleActiveChange(collectionId, active);
      }
    } catch (error) {
      console.error("Błąd aktualizacji transferu:", error);
    }
  };


  const handlePostedOnTwitterChange = async (collectionSelected) => {
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
        getAllCollections();
        console.log(response.data);
      } catch (error) {
        console.error("Błąd udostępniania na Twitterze:", error);
      }
    }
  };

  const goToCollection = (collection) => {
    navigate(`/CollectionDetails/${collection.id}`);
  };

  const handleSupportOverlayClick = (e) => {
    if (e.target.classList.contains("support-modal-overlay")) {
      setShowSupportModal(false);
    }
  };

  const [copyMessage, setCopyMessage] = useState("");

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopyMessage("Skopiowano!");
    setTimeout(() => setCopyMessage(""), 2000); // Resetuje wiadomość po 2 sekundach
  };

  const generateQrCode = async (collection) => {
    // if (isNaN(amount) || amount <= 0) {
    //   return ""; // Zwróć pusty string, jeśli kwota jest nieprawidłowa
    // }
    try {
      const response = await axios.get("http://localhost:8081/generate-qr", {
        params: {
          name: "Jakub Karaś",
          ibanWithoutPL: "32102028920000510209352958",
          amount: collection.collectionCollectedAmount,
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

  const [showSupportModal, setShowSupportModal] = useState(false);

  const [responseQR, setResponseQR] = useState();
  // Pobranie zbiórek po załadowaniu komponentu

  const handleSupportClick = (collection) => {
    setCollection(collection);
    getCollectionCreator(collection);
    setShowSupportModal(true); // Otwórz modal wsparcia
    generateQrCode(collection);
  };

  const getCollectionCreator = async (collection) => {
    try {
      const response = await axios.get("http://localhost:8081/user_FullName", {
        params: { id: collection.id },
      });
      setUserFullName(response.data);
    } catch (error) {
      console.error("Błąd pobierania nazwy usera tworzącego zbiórkę:", error);
    }
  };

  useEffect(() => {
    authenticatePage();
  });

  useEffect(() => {
    getAllCollections();
  }, [authenticated]);

  return (
    <div>
      <h1 className="gorne-buttony-State">Stan zbiórek</h1>
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
                <span
                  style={{
                    position: "absolute",
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: "20px",
                    color: "gray",
                    pointerEvents: "none",
                  }}
                >
                  {collection.collectionCollectedAmount}zł
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
                  value={collection.accountNumber}
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
                  value={"Przelew za zbiórkę: " + collection.collectionGoal}
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
                  value={userFullName}
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

      <div className="temp">
        {collections ? (
          <TableContainer
            component={Paper}
            sx={{ width: "95%", margin: "100px auto 0 auto" }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "rgb(235, 232, 232)" }}>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "id"}
                      direction={orderBy === "id" ? order : "asc"}
                      onClick={() => handleRequestSort("id")}
                    >
                      ID
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "collectionGoal"}
                      direction={orderBy === "collectionGoal" ? order : "asc"}
                      onClick={() => handleRequestSort("collectionGoal")}
                    >
                      Cel zbiórki
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "dateOfCreation"}
                      direction={orderBy === "dateOfCreation" ? order : "asc"}
                      onClick={() => handleRequestSort("dateOfCreation")}
                    >
                      Data utworzenia
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "collectionCollectedAmount"}
                      direction={
                        orderBy === "collectionCollectedAmount" ? order : "asc"
                      }
                      onClick={() =>
                        handleRequestSort("collectionCollectedAmount")
                      }
                      sx={{
                        textTransform: "none",
                        whiteSpace: "nowrap", // Zapobiega przenoszeniu tekstu do kolejnej linii
                        overflow: "hidden", // Ukrywa nadmiar tekstu
                        textOverflow: "ellipsis", // Dodaje "..." na końcu, jeśli tekst jest za długi
                      }}
                    >
                      Zebrano [zł]
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "collectionAmount"}
                      direction={orderBy === "collectionAmount" ? order : "asc"}
                      onClick={() => handleRequestSort("collectionAmount")}
                      sx={{
                        textTransform: "none",
                        whiteSpace: "nowrap", // Zapobiega przenoszeniu tekstu do kolejnej linii
                        overflow: "hidden", // Ukrywa nadmiar tekstu
                        textOverflow: "ellipsis", // Dodaje "..." na końcu, jeśli tekst jest za długi
                      }}
                    >
                      Cel [zł]
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "city"}
                      direction={orderBy === "city" ? order : "asc"}
                      onClick={() => handleRequestSort("city")}
                    >
                      Miasto
                    </TableSortLabel>
                  </TableCell>

                  <TableCell>
                    <TableSortLabel
                    >
                     Twitter
                    </TableSortLabel>
                  </TableCell>

                  <TableCell>Dane do przelewu</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "active"}
                      direction={orderBy === "active" ? order : "asc"}
                      onClick={() => handleRequestSort("active")}
                    >
                      Aktywna
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "transferred"}
                      direction={orderBy === "transferred" ? order : "asc"}
                      onClick={() => handleRequestSort("transferred")}
                    >
                      Wypłacono
                    </TableSortLabel>
                  </TableCell>
                  {/* <TableCell>Zakończ zbiórkę</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedCollections.map((collection) => (
                  <TableRow key={collection.id}>
                    <TableCell>{collection.id}</TableCell>
                    <TableCell>
                      <Button
                        sx={{
                          textTransform: "none",
                          whiteSpace: "nowrap", // Zapobiega przenoszeniu tekstu do kolejnej linii
                          overflow: "hidden", // Ukrywa nadmiar tekstu
                          textOverflow: "ellipsis", // Dodaje "..." na końcu, jeśli tekst jest za długi
                        }}
                        onClick={() => goToCollection(collection)}
                      >
                        {collection.collectionGoal}
                      </Button>
                      <IconButton
                        onClick={() => handleEditClick(collection)}
                        sx={{ ml: 1 }} // Dodaje mały margines po lewej stronie przycisku
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                    <TableCell>{collection.dateOfCreation}</TableCell>
                    <TableCell>
                      {collection.collectionCollectedAmount}
                    </TableCell>
                    <TableCell>{collection.collectionAmount}</TableCell>
                    <TableCell>{collection.city}</TableCell>
                    <TableCell><Switch
                        checked={collection.postedOnTwitter}
                        onChange={() =>
                          handlePostedOnTwitterChange(collection)
                        }
                      />
                      </TableCell>
                    <TableCell>
                      <Button onClick={() => handleSupportClick(collection)}>
                        {" "}
                        Pokaż
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={collection.active}
                        onChange={() =>
                          handleActiveChange(collection.id, collection.active)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={collection.transferred}
                        onChange={() =>
                          handleTransferChange(
                            collection.id,
                            collection.transferred,
                            collection.active
                          )
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <p>Brak zbiórek</p>
        )}
      </div>
      {/* <button className="back-button" onClick={handlePreviousPageClick}>
        Powrót
      </button> */}
    </div>
  );
}

export default CollectionState;
