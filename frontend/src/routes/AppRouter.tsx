import {Navigate, Route, Routes} from "react-router-dom";
import {useContext} from "react";
import {AccountTypeContext} from "../contexts/AccountTypeContext";

// User Pages
import HomePage from "../pages/home/HomePage.tsx";
import PetPage from "../pages/pet/PetPage.tsx";
import HealthcarePage from "../pages/healthcare/HealthcarePage.tsx";
import ServicesPage from "../pages/services/ServicesPage.tsx";
import ProfilePage from "../pages/profile/ProfilePage.tsx";
import SettingsPage from "../pages/settings/SettingsPage.tsx";
import VetPortalPage from "../pages/vetportal/VetPortalPage.tsx"; // Vet Profile Check Happens Here
// Vet Pages
import VetHomePage from "../pages/vetportal/HomePage.tsx";
import VetPetPage from "../pages/vetportal/PetPage.tsx";
import VetHealthcarePage from "../pages/vetportal/HealthcarePage.tsx";
import VetServicesPage from "../pages/vetportal/ServicesPage.tsx";
import VetProfilePage from "../pages/vetportal/ProfilePage.tsx"; // If vet fields are incomplete
// Public Pages
import LandingPage from "../pages/landing/Landing.tsx";
import WebSocketTester from "../pages/teleconsultation/websockettester/WebSocketTester.tsx";
import {NewTeleconsultPage} from "../pages/teleconsultation/websockettester/NewTeleconsultPage.tsx";

export const AuthenticatedRoutes = () => {
    const { accountType } = useContext(AccountTypeContext);

    return (
        <Routes>
            {/* Default Redirect Based on Account Type */}
            <Route path="*" element={<Navigate to={accountType === "vet" ? "/vet/home" : "/home"} />} />

            {/* User Routes (Always Accessible) */}
            <Route path="/home" element={<HomePage />} />
            <Route path="/pets" element={<PetPage />} />
            <Route path="/healthcare" element={<HealthcarePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/teleconsultation" element={<NewTeleconsultPage />} />
            <Route path="/teleconsultvet" element={<NewTeleconsultPage />} />
            <Route path="/wstest" element={<WebSocketTester />} />

            {/* Vet Portal Entry Point (Checks Vet Profile) */}
            <Route path="/vetportal" element={<VetPortalPage />} />

            {/* Vet Pages (Accessible Only If Vet Mode Is Active) */}
            {accountType === "vet" && (
                <>
                    <Route path="/vet/home" element={<VetHomePage />} />
                    <Route path="/vet/pets" element={<VetPetPage />} />
                    <Route path="/vet/healthcare" element={<VetHealthcarePage />} />
                    <Route path="/vet/services" element={<VetServicesPage />} />
                    <Route path="/vet/profile" element={<VetProfilePage />} />
                </>
            )}
        </Routes>
    );
};

export const UnauthenticatedRoutes = () => {
    return (
        <Routes>
            <Route path="*" element={<Navigate to="/" />} /> {/* Redirect unauthorized access */}
            <Route path="/" element={<LandingPage />} />
        </Routes>
    );
};
