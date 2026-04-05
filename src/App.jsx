// This is the main App component. It will contain the routes of the websites
import ApiTester from './assets/components/apitester'
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/home-page";
import AboutPage from "./pages/about-page";
import ContactPage from "./pages/contact-page";
import HelpCenterPage from "./pages/help-center-page";
import TermsPage from "./pages/terms-page";
import PrivacyPage from "./pages/privacy-page";

function App() {
  return (
    <>
      <ApiTester /> 
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contacts" element={<ContactPage />} />
        <Route path="/help-center" element={<HelpCenterPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
      </Routes>
    </>
  );
}

export default App;
