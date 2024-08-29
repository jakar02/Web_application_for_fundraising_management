import "./styles/StworzSzukajZbiorke.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useRef } from "react";

function CreateCollectionNext() {
  const location = useLocation();
  const { sendCollection} = location.state || {};
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [accountNumber, setAccountNumber] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [date, setDate] = useState("");

  const accountNumberRef = useRef(null);
  const descriptionRef = useRef(null);
  const cityRef = useRef(null);
  const dateRef = useRef(null);




  function handlePreviosPageClick() {
    const newSendCollection = {
      collectionGoal: sendCollection.collectionGoal,
      collectionAmount: sendCollection.collectionAmount,
      accountNumber: accountNumber,
      description: description,
      city: city,
      date: date,
      images: selectedFiles,
    };
    navigate("/CreateCollection", {state: { sendCollection: newSendCollection}});
  }

  function handleFileChange(event) {
    const files = Array.from(event.target.files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
  }

  const handleChange = (event) => {
    setDate(event.target.value);
  };

  const handleCreateCollectionClick = async () => {
    const token = localStorage.getItem("token"); // Pobierz token z localStorage

    // Tworzenie obiektu FormData
    const formData = new FormData();
    formData.append(
      "collection",
      new Blob(
        [
          JSON.stringify({
            collectionGoal: sendCollection.collectionGoal,
            collectionAmount: sendCollection.collectionAmount,
            accountNumber: accountNumber,
            description: description,
            city: city,
            date: date,
          }),
        ],
        { type: "application/json" }
      )
    );

    selectedFiles.forEach((file) => {
      formData.append("images", file);
    });

    try {
      await axios.post(
        "http://localhost:8081/auth/api/user_collections",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Ustawienie odpowiedniego Content-Type
          },
        }
      );
      console.log("Utworzono zbiorke");
    } catch (error) {
      console.error("Błąd tworzenia zbiorki:", error);
    }

    navigate("/");
    alert("Utworzono zbiorke");
  };

  const handleKey = (e) => {
    if (e.key === "Enter") {
      handleCreateCollectionClick();
    } else if (e.key === "ArrowDown") {
      if (e.target === accountNumberRef.current) {
        descriptionRef.current.focus();
      } else if (e.target === descriptionRef.current) {
        cityRef.current.focus();
      } else if (e.target === cityRef.current) {
        dateRef.current.focus();
      }
    } else if (e.key === "ArrowUp") {
      if (e.target === descriptionRef.current) {
        accountNumberRef.current.focus();
      }
      if (e.target === cityRef.current) {
        descriptionRef.current.focus();
      }
      if (e.target === dateRef.current) {
        cityRef.current.focus();
      }
    }
  };


  useEffect(() => { 
    if(sendCollection.accountNumber){
      setAccountNumber(sendCollection.accountNumber);
    }
    if(sendCollection.description){
      setDescription(sendCollection.description);
    }
    if(sendCollection.city){
      setCity(sendCollection.city);
    }
    if(sendCollection.date){
      setDate(sendCollection.date);
    }
    if(sendCollection.images){
      setSelectedFiles(sendCollection.images);
    }
  }, []);


  return (
    <div className="stworz-zbiorke-all">
      <div className="gorne-buttony3">
        <h1>Stwórz zbiórkę</h1>
      </div>
      <TextField
        label="Numer konta bankowego do przelewu"
        variant="outlined"
        size="normal"
        margin="normal"
        sx={{ backgroundColor: "white", marginBottom: "20px" }}
        value={accountNumber}
        onChange={(e) => setAccountNumber(e.target.value)}
        inputRef={accountNumberRef}
        onKeyDown={handleKey}
      />

      <TextField
        label="Opis"
        variant="outlined"
        multiline
        rows={4}
        sx={{
          backgroundColor: "white",
          marginBottom: "10px",
          "& .MuiInputBase-root": {
            height: "auto",
          },
        }}
        fullWidth
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        inputRef={descriptionRef}
        onKeyDown={handleKey}
      />

      <TextField
        label="Miasto"
        variant="outlined"
        size="normal"
        margin="normal"
        sx={{ backgroundColor: "white", marginBottom: "20px" }}
        value={city}
        onChange={(e) => setCity(e.target.value)}
        inputRef={cityRef}
        onKeyDown={handleKey}
      />

      <TextField
        label="Wybierz datę zakończenia zbiórki"
        type="date"
        value={date}
        onChange={handleChange}
        inputRef={dateRef}
        onKeyDown={handleKey}
        sx={{
          backgroundColor: "white",
          marginBottom: "20px",
          width: "100%",
        }}
        InputLabelProps={{
          shrink: true,
        }}
      />

      <label className="image-upload-btn" htmlFor="image-input">
        <b>Dodaj zdjęcia (&lt;1MB)</b>
      </label>
      <input
        id="image-input"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="image-input"
        multiple
      />

      {selectedFiles.length > 0 && (
        <div className="selected-image-info">
          {selectedFiles.map((file, index) => (
            <p key={index}>{`${index + 1})   ${file.name}`}</p>
          ))}
        </div>
      )}

      <div className="button-container">
        <button className="button-anuluj" onClick={handlePreviosPageClick}>
          ←Cofnij
        </button>
        <button
          className="button-stworz-zbiorke"
          onClick={handleCreateCollectionClick}
        >
          {sendCollection.description ? "Aktualizuj" : "Stwórz"}
        </button>
      </div>

      <p className="page-info">Strona 2/2</p>
    </div>
  );
}

export default CreateCollectionNext;
