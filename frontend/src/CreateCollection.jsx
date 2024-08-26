import "./styles/StworzSzukajZbiorke.css";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import { useRef } from "react";

function CreateCollection() {
  const navigate = useNavigate();

  const [collectionGoal, setCollectionGoal] = useState("");
  const [collectionAmount, setCollectionAmount] = useState("");

  const goalRef = useRef(null);
  const amountRef = useRef(null);

  function handleAnulujClick() {
    navigate("/");
  }

  function handleDalejClick() {
    if (collectionGoal === "") {
      alert("Podaj cel zbiorki!");
      return;
    }
    if (Number(collectionAmount) < 0 || isNaN(Number(collectionAmount))) {
      alert("Podaj poprawną kwotę zbiórki!");
      return;
    }
    navigate("/CreateCollectionNext", {
      state: { collectionGoal, collectionAmount },
    });
  }


  const handleKey = (e) => {
    if (e.key === "Enter") {
      handleDalejClick();
    } else if (e.key === "ArrowDown") {
      if (e.target === goalRef.current) {
        amountRef.current.focus();
      }
    } else if (e.key === "ArrowUp") {
      if (e.target === amountRef.current) {
        goalRef.current.focus();
      }
    }
  };




  return (
    <div className="stworz-zbiorke-all">
      <TextField
        label="Cel zbiórki"
        variant="outlined"
        size="normal"
        margin="normal"
        sx={{ backgroundColor: "white", marginBottom: "20px" }}
        value={collectionGoal}
        onChange={(e) => setCollectionGoal(e.target.value)}
        inputRef={goalRef}
        onKeyDown={handleKey}
      />

      <TextField
        label="Zbierana kwota"
        variant="outlined"
        placeholder="0,00"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <span style={{ fontSize: "50px" }}>zł</span>
            </InputAdornment>
          ),
        }}
        fullWidth
        inputProps={{
          style: {
            fontSize: "50px", // Rozmiar tekstu w inp
            height: "70px", // Ustaw wysokość dla inputa, standardowa dla `outlined`
            padding: "12px 14px", // Padding wewnątrz pola
          },
        }}
        sx={{
          backgroundColor: "white",
          // Dostosuj wysokość tekstowego inputa
          "& .MuiInputBase-input": {
            fontSize: "18px",
            padding: "12px 14px",
          },
          // Dostosuj wysokość label
          "& .MuiInputLabel-root": {
            fontSize: "16px",
            top: "-8px", // Przesuwa etykietę w górę
            transform: "translateY(0)", // Resetuje przekształcenie
          },
          "& .MuiInputLabel-shrink": {
            top: "-8px", // Ustawienie dla etykiety, gdy jest w stanie "shrink"
            left: "14px", // Ustawienie dla etykiety, gdy jest w stanie "shrink"
            transform: "translateY(0)", // Resetuje przekształcenie
            fontSize: "12px", // Opcjonalne dostosowanie rozmiaru czcionki, gdy etykieta jest w stanie "shrink"
          },
        }}
        InputLabelProps={{
          shrink: true, // Ustawia, aby etykieta była zawsze widoczna
        }}
        value={collectionAmount}
        onChange={(e) => setCollectionAmount(e.target.value)}
        inputRef={amountRef}
        onKeyDown={handleKey}
      />

      <div className="button-container">
        <button className="button-anuluj" onClick={handleAnulujClick}>
          Anuluj ✖
        </button>
        <button className="button-dalej" onClick={handleDalejClick}>
          Dalej→
        </button>
      </div>

      <p className="page-info">Strona 1/2</p>
    </div>
  );
}

export default CreateCollection;
