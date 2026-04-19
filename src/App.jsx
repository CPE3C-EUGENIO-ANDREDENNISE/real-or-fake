// This is the main App component. It will contain the routes of the websites
import ApiTester from './assets/components/apitester'
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/home-page";
import AboutPage from "./pages/about-page";
import ContactPage from "./pages/contact-page";
import ResultsPage from "./pages/results-page";
import HelpCenterPage from "./pages/help-center-page";
import TermsPage from "./pages/terms-page";
import PrivacyPage from "./pages/privacy-page";
import LandingPage from "./pages/landing-page";
import SettingsPage from "./pages/settings-page";
import LoginPage from "./pages/login-page";
import SignUpPage from "./pages/sign-up-page";

const PrivateRoute = ({ children }) => {
  return localStorage.getItem("authToken") ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <>   
      
      <Routes>\
        <Route path="/apitester" element={<ApiTester/>} />
        <Route path="/results" element={<ResultsPage/>} />
        <Route path="/api-tester" element={<ApiTester />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contacts" element={<ContactPage />} />
        <Route path="/help-center" element={<HelpCenterPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/landing" element={
          <PrivateRoute>
            <LandingPage />
          </PrivateRoute>
          } />
      </Routes>
    </>
  );
}

export default App;
