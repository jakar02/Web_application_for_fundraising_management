import "../styles/CreateCollection.css";
import { useNavigate, useLocation } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { useState, useRef, useEffect } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import axios from "axios";

function CreateCollection() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const [authenticated, setAuthenticated] = useState(false);
  const{ sendCollection } = location.state ?? {};

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

    
    if(sendCollection === undefined){
      const newSendCollection = {
        collectionGoal: collectionGoal,
        collectionAmount: collectionAmount
      };
      navigate("/CreateCollectionNext", {
        state: { sendCollection: newSendCollection },
      });
    } else {
      const newSendCollection = {
        id: sendCollection.id,
        collectionGoal: collectionGoal,
        collectionAmount: collectionAmount,
        accountNumber: sendCollection.accountNumber,
        description: sendCollection.description,
        city: sendCollection.city,
        date: sendCollection.date,
        images: sendCollection.images};

        //console.log("id: ", sendCollection.id);
        navigate("/CreateCollectionNext", {
          state: { sendCollection: newSendCollection },
        });        
      }
    
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

  const handleSetCollectionAmount = (e) => {

    let value = e.target.value;

    value = value.replace(',', '.');
  
    const roundedValue = Math.round(Number(value));
    
    if (!isNaN(roundedValue)) {
      setCollectionAmount(roundedValue.toString());
    } else {
      setCollectionAmount('');
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

  useEffect(() => {
    authenticatePage();
  }, []);

  useEffect(() => {
    if (sendCollection) {
      setCollectionGoal(sendCollection.collectionGoal);
      setCollectionAmount(sendCollection.collectionAmount);
    }
  }, [authenticated]);



  return (
    <div className="stworz-zbiorke-all">
      <div className="gorne-buttony3"> 
        <h1>Stwórz zbiórkę</h1>
      </div>
      <TextField
        label="Cel zbiórki"
        variant="outlined"
        size="normal"
        autoComplete="off"
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
        placeholder="0"
        autoComplete="off"
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
            fontSize: "50px", 
            height: "70px", 
            padding: "12px 14px",
          },
        }}
        sx={{
          backgroundColor: "white",
          "& .MuiInputBase-input": {
            fontSize: "18px",
            padding: "12px 14px",
          },
          "& .MuiInputLabel-root": {
            fontSize: "16px",
            top: "-8px", 
            transform: "translateY(0)", 
          },
          "& .MuiInputLabel-shrink": {
            top: "-8px", 
            left: "14px", 
            transform: "translateY(0)", 
            fontSize: "12px",
          },
        }}
        InputLabelProps={{
          shrink: true,
        }}
        value={collectionAmount}
        onChange={(e) => handleSetCollectionAmount(e)}
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
