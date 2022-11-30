import {
  Routes,
  Route,
  useNavigationType,
  useLocation,
} from "react-router-dom";
import DoubtsPage from "./pages/DoubtsPage";
import DoubtPosting from "./pages/DoubtPosting";
import SolutionPage from "./pages/SolutionPage";
import LoginPage from "./pages/LoginPage";
import YourAccount from "./pages/YourAccount";
import { useEffect } from "react";
import { UploadWidget } from './pages/UploadWidget';

function App() {
  const action = useNavigationType();
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    if (action !== "POP") {
      window.scrollTo(0, 0);
    }
  }, [action]);

  useEffect(() => {
    let title = "";
    let metaDescription = "";

    //TODO: Update meta titles and descriptions below
    switch (pathname) {
      case "/":
        title = "";
        metaDescription = "";
        break;
    }

    if (title) {
      document.title = title;
    }

    if (metaDescription) {
      const metaDescriptionTag = document.querySelector(
        'head > meta[name="description"]'
      );
      if (metaDescriptionTag) {
        metaDescriptionTag.content = metaDescription;
      }
    }
  }, [pathname]);

  return (
    <Routes>
      <Route path="/" element={<DoubtsPage />} />
      <Route path="/newdoubt" element={<DoubtPosting />} />
      <Route path="/solution" element={<SolutionPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/account" element={<YourAccount />} />
    </Routes>
  );
}
export default App;
