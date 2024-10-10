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
  Switch
} from "@mui/material";
import "../styles/CollectionState.css";
import axios from "axios";

function CollectionState() {
  const navigate = useNavigate();
  const [collections, setCollections] = useState(null);
  const [order, setOrder] = useState("desc"); // Sortowanie rosnące/ malejące
  const [orderBy, setOrderBy] = useState("active"); // Domyślnie sortowanie po ID
  const token = localStorage.getItem("token");

  // Pobranie kolekcji z API
  const getAllCollections = async () => {
    try {
      const response = await axios.get("http://localhost:8081/all_collections");
      console.log("Poprawnie pobrano zbiorki:", response.data);
      setCollections(response.data);
    } catch (error) {
      console.error("Błąd pobierania zbiorek:", error);
    }
  };

  // Powrót do poprzedniej strony
  function handlePreviousPageClick() {
    navigate("/");
  }

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
          params: { id: collectionId, newState: !active },  // Zmieniamy na odwrotny stan
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

    // Funkcja do obsługi zmiany stanu 'Przelano' (Switch)
    const handleTransferChange = async (collectionId, transferred) => {
        try {
          // Wyślij żądanie do API, aby zaktualizować stan 'transferred'
          await axios.post(
            "http://localhost:8081/auth/api/update_transferred",
            null,
            {
              params: { id: collectionId, newState: !transferred },  // Aktualizujemy odwrotnie
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          // Po aktualizacji odświeżamy listę
          getAllCollections();
        } catch (error) {
          console.error("Błąd aktualizacji transferu:", error);
        }
      };

  // Pobranie zbiórek po załadowaniu komponentu
  useEffect(() => {
    getAllCollections();

  }, []);

  return (
    <div>
      <h1 className="gorne-buttony-State">Stan zbiórek</h1>
      <div className="temp">
        {collections ? (
          <TableContainer
            component={Paper}
            sx={{ width: "95%", margin: "100px auto 0 auto" }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{backgroundColor: "rgb(235, 232, 232)"}}>
                    
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
                    >
                      Zebrano
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "collectionAmount"}
                      direction={orderBy === "collectionAmount" ? order : "asc"}
                      onClick={() => handleRequestSort("collectionAmount")}
                    >
                      Zbierana kwota
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
                      active={orderBy === "accountNumber"}
                      direction={orderBy === "accountNumber" ? order : "asc"}
                      onClick={() => handleRequestSort("accountNumber")}
                    >
                      Numer konta
                    </TableSortLabel>
                  </TableCell>
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
                    <TableCell>{collection.collectionGoal}</TableCell>
                    <TableCell>{collection.dateOfCreation}</TableCell>
                    <TableCell>{collection.collectionCollectedAmount}</TableCell>
                    <TableCell>{collection.collectionAmount}</TableCell>
                    <TableCell>{collection.city}</TableCell>
                    <TableCell>{collection.accountNumber}</TableCell>
                    <TableCell>

                      <Switch
                        checked={collection.active}
                        onChange={() =>
                          handleActiveChange(collection.id, collection.active)
                        }
                      />
                    </TableCell>
                    {/* <TableCell>{collection.active ? "Tak" : "Nie"}</TableCell> */}
                    <TableCell>
                      {/* Suwak (Switch) do zmiany stanu 'Przelano' */}
                      <Switch
                        checked={collection.transferred}
                        onChange={() =>
                          handleTransferChange(collection.id, collection.transferred)
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
      <button className="back-button" onClick={handlePreviousPageClick}>
        Powrót
      </button>
    </div>
  );
}

export default CollectionState;
