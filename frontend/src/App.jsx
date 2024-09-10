import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import OperationsPage from "./pages/OperationsPage";
import SimilarityPage from "./pages/SimilarityPage";
import CreditsPage from "./pages/CreditsPage";
import DetailsPage from "./pages/DetailsPage";
import DataProvider from "./context/apiContext";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <DataProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/operations" element={<OperationsPage />} />
          <Route path="/similarity" element={<SimilarityPage />} />
          <Route path="/credits" element={<CreditsPage />} />
          <Route path="/details/:image" element={<DetailsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </DataProvider>
  );
}
