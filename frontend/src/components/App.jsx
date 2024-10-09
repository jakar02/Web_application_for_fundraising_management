import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainPage from "./MainPage";
import CreateCollection from "./CreateCollection";
import CreateCollectionNext from "./CreateCollectionNext";
import CollectionDetails from "./CollectionDetails";
import ManageYourCollections from "./ManageYourCollections";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/CreateCollection" element={<CreateCollection />} />
        <Route path="/CreateCollectionNext" element={<CreateCollectionNext />} />
        <Route path="/CollectionDetails/:id" element={<CollectionDetails />} />
        <Route path="/ManageYourCollections" element={<ManageYourCollections />} />
      </Routes>
    </Router>
  );
}

export default App;
