import "./StworzSzukajZbiorke.css";
import { useState } from "react";

function StworzZbiorkeNext() {
  const [selectedFiles, setSelectedFiles] = useState([]);

  function handleCofnijClick() {
    window.location.href = "./StworzZbiorke.jsx";
  }

  function handleFileChange(event) {
    const files = Array.from(event.target.files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
  }

  return (
    <div className="stworz-zbiorke-all">
      <label htmlFor="numer-konta-input" className="numer-konta-input">
        <b>Numer konta bankowego do przelewu</b>
      </label>
      <input
        id="stworz-zbiorke-all"
        type="text"
        placeholder=""
        className="kto-input"
      />

      <label htmlFor="opis-input" className="opis-font">
        <b>Opis</b>
      </label>
      <textarea id="opis-input" placeholder="" className="opis-input" />

      <label htmlFor="region-input">
        <b>Region</b>
      </label>
      <input
        id="region-input"
        type="text"
        placeholder="np. Kraków"
        className="region-input"
      />

      <label htmlFor="data-input">
        <b>Data zakończenia</b>
      </label>
      <input
        id="data-input"
        type="text"
        placeholder="np. 01.01.2024"
        className="data-input"
      />

      <label className="image-upload-btn" htmlFor="image-input">
        <b>Dodaj zdjęcia</b>
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
        <button className="button-anuluj" onClick={handleCofnijClick}>
          ←Cofnij
        </button>
        <button className="button-stworz-zbiorke">Stwórz</button>
      </div>

      <p className="page-info">Strona 2/2</p>
    </div>
  );
}

export default StworzZbiorkeNext;
