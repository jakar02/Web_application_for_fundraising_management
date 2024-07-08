import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainPage from "./MainPage";
import StworzZbiorke from "./StworzZbiorke";
import SzukajZbiorke from "./SzukajZbiorke";
import StworzZbiorkeNext from "./StworzZbiorkeNext";
import ZbiorkaSzczegoly from "./ZbiorkaSzczegoly";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/StworzZbiorke.jsx" element={<StworzZbiorke />} />
        <Route path="/SzukajZbiorke.jsx" element={<SzukajZbiorke />} />
        <Route path="/StworzZbiorkeNext.jsx" element={<StworzZbiorkeNext />} />
        <Route path="/ZbiorkaSzczegoly.jsx" element={<ZbiorkaSzczegoly />} />
      </Routes>
    </Router>
  );
}

export default App;
