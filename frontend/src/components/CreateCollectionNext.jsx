import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TextField from "@mui/material/TextField";
import InputMask from "react-input-mask";
import axios from "axios";
import "../styles/CreateCollection.css";

function CreateCollectionNext() {
  const location = useLocation();
  const { sendCollection } = location.state || {};
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

  const handleSetCity = (e) => {
    let text = e.target.value;
    setCity(text.charAt(0).toUpperCase() + text.slice(1)) ;
  }

  function handlePreviosPageClick() {
    const newSendCollection = {
      collectionId: sendCollection.id,
      collectionGoal: sendCollection.collectionGoal,
      collectionAmount: sendCollection.collectionAmount,
      accountNumber: accountNumber,
      description: description,
      city: city,
      date: date,
      images:
        selectedFiles.length > 0 ? selectedFiles : sendCollection.images || [],
    };
    navigate("/CreateCollection", {
      state: { sendCollection: newSendCollection },
    });
  }

  function handleFileChange(event) {
    const files = Array.from(event.target.files);
    if (selectedFiles.length + files.length > 4) {
      alert("Limit zdjęć to 4");
    } else {
      setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
    }
  }

  function handleFileRemove(index) {
    setSelectedFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      return newFiles;
    });
  }

  const handleChange = (event) => {
    setDate(event.target.value);
  };

  const handleCreateCollectionClick = async () => {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append(
      "collection",
      new Blob(
        [
          JSON.stringify({
            id: sendCollection.id,
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
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Utworzono zbiorke");
      navigate("/");
    } catch (error) {
      console.error("Błąd tworzenia zbiorki:", error);
    }

    alert("Utworzono zbiorke");
  };

  const handleUpdateCollectionClick = async () => {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append(
      "collection",
      new Blob(
        [
          JSON.stringify({
            id: sendCollection.id,
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

    if (selectedFiles.length === 0) {
      formData.append("images", new Blob([]));
    } else {
      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });
    }

    try {
      await axios.post(
        "http://localhost:8081/auth/api/update_user_collections",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Zaktualizowano zbiorke");
      navigate("/");
      alert("Zaktualizowano zbiorke");
    } catch (error) {
      console.error("Błąd aktualizacji zbiorki:", error);
    }
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
    if (sendCollection.accountNumber) {
      setAccountNumber(sendCollection.accountNumber || "");
    }
    if (sendCollection.description) {
      setDescription(sendCollection.description || "");
    }
    if (sendCollection.city) {
      setCity(sendCollection.city || "");
    }
    if (sendCollection.date) {
      setDate(sendCollection.date || "");
    }
    if (sendCollection.images) {
      const formattedImages = sendCollection.images.map((img) => {
        const byteCharacters = atob(img.imageData);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "image/jpeg" });
        const file = new File([blob], img.imageName, { type: "image/jpeg" });

        return file;
      });
      setSelectedFiles(formattedImages);
    } else {
      setSelectedFiles([]);
    }
  }, [sendCollection]);

  return (
    <div className="stworz-zbiorke-all">
      <div className="gorne-buttony3">
        <h1>Stwórz zbiórkę</h1>
      </div>

    <InputMask
      mask="99 9999 9999 9999 9999 9999 9999 9999" // Adjust to match the account number format
      value={accountNumber}
      onChange={(e) => setAccountNumber(e.target.value)}
      maskChar=""
    >
      {(inputProps) => (
        <TextField
          {...inputProps}
          label="Numer konta bankowego do przelewu"
          variant="outlined"
          size="normal"
          margin="normal"
          autoComplete="off"
          sx={{ backgroundColor: "white", marginBottom: "20px" }}
          inputRef={accountNumberRef}
          onKeyDown={handleKey}
        />
      )}
    </InputMask>

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
        onChange={(e) => handleSetCity(e)}
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
            <div
              key={index}
              onClick={() => handleFileRemove(index)}
              className="file-item"
            >
              {`${index + 1}) ${file.name}`} <br />
            </div>
          ))}
        </div>
      )}

      <div className="button-container">
        <button className="button-anuluj" onClick={handlePreviosPageClick}>
          ←Cofnij
        </button>
        <button
          className="button-stworz-zbiorke"
          onClick={
            sendCollection.description || sendCollection.accountNumber
              ? handleUpdateCollectionClick
              : handleCreateCollectionClick
          }
        >
          {sendCollection.description || sendCollection.accountNumber
            ? "Aktualizuj"
            : "Stwórz"}
        </button>
      </div>

      <p className="page-info">Strona 2/2</p>
    </div>
  );
}

export default CreateCollectionNext;
