import "../styles/MainPage.css";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

function MainPage() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(0); //0 - nie pokazuj, 1 - logowanie, 2 - rejestracja
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailRegister, setEmailRegister] = useState("");
  const [passwordRegister, setPasswordRegister] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [fullName, setFullNameRegister] = useState("");
  const [navigateRequest, setNavigateRequest] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLogged") === "true" 
  );
  const [searchValue, setSearchValue] = useState("");
  const [sortValue, setSortValue] = useState("");

  const [collections, setCollections] = useState([]);
  const [filteredCollections, setFilteredCollections] = useState([]);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const fullNameRef = useRef(null);
  const emailRegisterRef = useRef(null);
  const passwordRegisterRef = useRef(null);
  const passwordRepeatRef = useRef(null);

  const handleLoginLogoutClick = () => {
    if (localStorage.getItem("isLogged")) {
      localStorage.removeItem("token");
      localStorage.removeItem("isLogged");
      localStorage.removeItem("role");  
      setIsLoggedIn(false);
    } else {
      setShowModal(1);
    }
  };

  const handleLoginInModalClick = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8081/signin",
        {
          email: email,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Login successful!");
      const { jwt } = response.data;
      localStorage.setItem("token", jwt);
      localStorage.setItem("role", response.data.role);
      //console.log("Role: ", response.data.role);
      localStorage.setItem("isLogged", true);
      setIsLoggedIn(true);
      setShowModal(0);
      if (navigateRequest) {
        navigate(`${navigateRequest}`);
        setNavigateRequest("");
      }
    } catch (error) {
      console.error("Błąd logowania:", error);
    }
  };

  const handleRegisterInModalClick = async () => {
    try {
      await axios.post(
        "http://localhost:8081/signup",
        {
          fullName: fullName,
          email: emailRegister,
          password: passwordRegister,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Signup successful!");
      localStorage.setItem("isLogged", true);
      setIsLoggedIn(true);
      setShowModal(0);
    } catch (error) {
      console.error("Błąd rejestracji:", error);
    }
  };

  const handleRegisterClick = () => {
    setShowModal(2);
  };

  const handleCloseModal = () => {
    setShowModal(0);
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      handleCloseModal();
    }
  };

  const handleCollectionClick = (collection) => {
    navigate(`/CollectionDetails/${collection.id}`, { state: { collection } });
  };

  const handleCollectionStateClick = () => {
    //console.log(collections)
    navigate(`/CollectionState/`, {state: {collections}} );
  };

  const handleCreateCollectionClick = async () => {
    if (localStorage.getItem("isLogged")) {
      navigate("/CreateCollection");
    } else {
      handleLoginLogoutClick();
      setNavigateRequest("/CreateCollection");
    }
  };

  const handleYourCollectionsClick = () => {
    if (localStorage.getItem("isLogged")) {
      navigate("/ManageYourCollections");
      return;
    } else {
      handleLoginLogoutClick();
      setNavigateRequest("/ManageYourCollections");
    }
  };

  const showCollections = async () => {
    try {
      const response = await axios.get("http://localhost:8081/all_active_collections");
      //console.log("Poprawnie pobrano zbiorki:", response.data);
      setCollections(response.data);
      setFilteredCollections(response.data);
    } catch (error) {
      console.error("Błąd pobierania zbiorek:", error);
    }
  };



  // Function to handle keydown events in the login modal
  const handleKeyLogin = (e) => {
    if (e.key === "Enter") {
      handleLoginInModalClick();
    } else if (e.key === "ArrowDown") {
      if (e.target === emailRef.current) {
        passwordRef.current.focus();
      }
    } else if (e.key === "ArrowUp") {
      if (e.target === passwordRef.current) {
        emailRef.current.focus();
      }
    }
  };

  const handleKeyRegister = (e) => {
    if (e.key === "Enter") {
      handleRegisterInModalClick();
    } else if (e.key === "ArrowDown") {
      if (e.target === fullNameRef.current) {
        emailRegisterRef.current.focus();
      } else if (e.target === emailRegisterRef.current) {
        passwordRegisterRef.current.focus();
      } else if (e.target === passwordRegisterRef.current) {
        passwordRepeatRef.current.focus();
      }
    } else if (e.key === "ArrowUp") {
      if (e.target === emailRegisterRef.current) {
        fullNameRef.current.focus();
      }
      if (e.target === passwordRegisterRef.current) {
        emailRegisterRef.current.focus();
      }
      if (e.target === passwordRepeatRef.current) {
        passwordRegisterRef.current.focus();
      }
    }
  };

  const handleSortChange = (event) => {
    setSortValue(event.target.value);
  };

  const fetchAccountState = async () => {
    try {
      await axios.get("http://localhost:8081/account/082e7fe0-5a7f-42fa-a294-39d943ca53a0/transactions");
      //console.log("Fetching account state");
    } catch (error) {
      console.error("Błąd pobierania:", error);
    }
  };

  const calculateProgress = (collection) => {
    return (
      (collection.collectionCollectedAmount / collection.collectionAmount) * 100
    );
  };

  useEffect (() => {
    if (sortValue === "najnowsze") {
      setFilteredCollections(collections.sort((a, b) => a.dateOfCreation - b.dateOfCreation));
    } else if (sortValue === "najstarsze") {
      setFilteredCollections(collections.sort((a, b) => b.dateOfCreation - a.dateOfCreation));
    } else if (sortValue === "brakujaca kwota malejaco") {
      setFilteredCollections(collections.sort((a, b) => b.collectionAmount - b.collectionCollectedAmount - (a.collectionAmount - a.collectionCollectedAmount) ));
    } else if (sortValue === "brakujaca kwota rosnaco") {
      setFilteredCollections(collections.sort((a, b) => a.collectionAmount - a.collectionCollectedAmount - (b.collectionAmount - b.collectionCollectedAmount) ));
  }
},[sortValue]);




useEffect(() => {
  fetchAccountState(); 
  showCollections();   
}, []);




  useEffect(() => {
    let sortedCollections = [...collections]; 
  
    if (sortValue === "najnowsze") {
      sortedCollections.sort((a, b) => new Date(b.dateOfCreation) - new Date(a.dateOfCreation));
    } else if (sortValue === "najstarsze") {
      sortedCollections.sort((a, b) => new Date(a.dateOfCreation) - new Date(b.dateOfCreation));
    } else if (sortValue === "brakujaca kwota malejaco") {
      sortedCollections.sort((a, b) => (b.collectionAmount - b.collectionCollectedAmount) - (a.collectionAmount - a.collectionCollectedAmount));
    } else if (sortValue === "brakujaca kwota rosnaco") {
      sortedCollections.sort((a, b) => (a.collectionAmount - a.collectionCollectedAmount) - (b.collectionAmount - b.collectionCollectedAmount));
    }
  
    setFilteredCollections(sortedCollections); 
  }, [sortValue, collections]);
  

  useEffect(() => {
    const filtered = collections.filter((collection) =>
      collection.collectionGoal.toLowerCase().includes(searchValue.toLowerCase()) ||
      collection.description.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredCollections(filtered);
    setSortValue("najnowsze");
  }, [searchValue, collections]);


  
  return (
    <div className={`all-main-page ${showModal != 0 ? "modal-active" : ""}`}>
      <div className="gorne-buttony">
        <div className="button-tworz-szukaj">
          {localStorage.getItem("role")==="ROLE_ADMIN" &&
          <button className="button-stan"  onClick={handleCollectionStateClick}>
          Stan zbiórek
          </button>
          }
          <button className="button-twoje" onClick={handleYourCollectionsClick}>
            Twoje zbiórki
          </button>
          <button
            className="button-tworz"
            onClick={handleCreateCollectionClick}
          >
            Stwórz zbiórkę
          </button>
        </div>
        <div className="button-loguj-rejestruj">
          <button className="button-loguj" onClick={handleLoginLogoutClick}>
            {isLoggedIn ? "Wyloguj się" : "Zaloguj się"}
          </button>
          <button className="button-rejestruj" onClick={handleRegisterClick}>
            Zarejestruj się
          </button>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TextField
          id="search-input"
          label="Szukaj zbiórki"
          variant="outlined"
          size="normal"
          margin="normal"
          sx={{
            backgroundColor: "white",
            marginTop: "40px",
            marginBottom: "-20px",
            width: "25%",
          }}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />

        <FormControl
          variant="outlined"
          sx={{
            minWidth: 244,
            marginTop: "40px",
            marginBottom: "-20px",
            marginLeft: "10px",
            backgroundColor: "white",
          }}
        >
          <InputLabel id="sort-label">Sortuj według</InputLabel>
          <Select
            labelId="sort-label"
            value={sortValue}
            onChange={handleSortChange}
            label="Sortuj według"
          >
            <MenuItem value="najnowsze">Najnowsze</MenuItem>
            <MenuItem value="najstarsze">Najstarsze</MenuItem>
            <MenuItem value="brakujaca kwota malejaco">
              Brakująca kwota malejąco
            </MenuItem>
            <MenuItem value="brakujaca kwota rosnaco">
              Brakująca kwota rosnąco
            </MenuItem>
          </Select>
        </FormControl>
      </div>

      <div className="main-page-grid">
        {filteredCollections.map((collection) => (
          <div
            className="main-page-content"
            onClick={() => handleCollectionClick(collection)}
            key={collection.id}
            to={{
              pathname: `/collection/${collection.id}`,
              state: { collection },
            }}
          >
            <div className="collection-frame">
              {collection.images && collection.images.length > 0 && (
                <img
                  src={`data:image/jpeg;base64,${collection.images[0].imageData}`}
                  className="collection-image"
                  alt="zdjecie"
                />
              )}
              <p className="collection-title">{collection.collectionGoal}</p>
              <p className="collection-description">{collection.description}</p>
              <div className="collection-fundsWithCity">
                <p className="collection-funds">
                  {collection.collectionCollectedAmount} z {collection.collectionAmount} zł
                </p>
                <p className="collection-city">
                  <LocationOnIcon
                    sx={{ fontSize: 18, marginRight: "2px", color: "gray" }} 
                  />
                  {collection.city}
                </p>
              </div>

              <Box
                sx={{
                  marginBottom: "15px",
                  marginLeft: "10px",
                  marginRight: "10px",
                }}
              >
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
            </div>
          </div>
        ))}
      </div>

      {showModal == 1 && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div className="modal">
            <h2>{"Logowanie"}</h2>
            <TextField
              label="Email"
              variant="outlined"
              size="small"
              margin="normal"
              value={email}
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              inputRef={emailRef}
              onKeyDown={handleKeyLogin}
            />
            <TextField
              label="Hasło"
              variant="outlined"
              size="small"
              margin="normal"
              value={password}
              autoComplete="off"
              onChange={(e) => setPassword(e.target.value)}
              inputRef={passwordRef}
              onKeyDown={handleKeyLogin}
            />
            <button onClick={handleLoginInModalClick}>Zaloguj się</button>
          </div>
        </div>
      )}

      {showModal == 2 && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div className="modal">
            <h2>{"Rejestracja"}</h2>
            <TextField
              label="Imię i nazwisko"
              margin="normal"
              size="small"
              variant="outlined"
              value={fullName}
              autoComplete="off"
              onChange={(e) => setFullNameRegister(e.target.value)}
              inputRef={fullNameRef}
              onKeyDown={handleKeyRegister}
            />
            <TextField
              label="Email"
              variant="outlined"
              size="small"
              margin="normal"
              autoComplete="off"
              value={emailRegister}
              onChange={(e) => setEmailRegister(e.target.value)}
              inputRef={emailRegisterRef}
              onKeyDown={handleKeyRegister}
            />
            <TextField
              label="Hasło"
              variant="outlined"
              size="small"
              margin="normal"
              value={passwordRegister}
              autoComplete="off"
              onChange={(e) => setPasswordRegister(e.target.value)}
              inputRef={passwordRegisterRef}
              onKeyDown={handleKeyRegister}
            />
            <TextField
              label="Powtórz hasło"
              margin="normal"
              size="small"
              variant="outlined"
              value={passwordRepeat}
              autoComplete="off"
              onChange={(e) => setPasswordRepeat(e.target.value)}
              inputRef={passwordRepeatRef}
              onKeyDown={handleKeyRegister}
            />

            <button onClick={handleRegisterInModalClick}>
              Zarejestruj się
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default MainPage;
