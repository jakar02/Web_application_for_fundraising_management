import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainPage from "./MainPage";
import CreateCollection from "./CreateCollection";
import SearchForCollection from "./SearchForCollection";
import CreateCollectionNext from "./CreateCollectionNext";
import CollectionDetails from "./CollectionDetails";
import ManageCollections from "./ManageCollections";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/CreateCollection" element={<CreateCollection />} />
        <Route path="/SearchForCollection" element={<SearchForCollection />} />
        <Route path="/CreateCollectionNext" element={<CreateCollectionNext />} />
        <Route path="/CollectionDetails" element={<CollectionDetails />} />
        <Route path="/ManageCollections" element={<ManageCollections />} />
      </Routes>
    </Router>
  );
}

export default App;
