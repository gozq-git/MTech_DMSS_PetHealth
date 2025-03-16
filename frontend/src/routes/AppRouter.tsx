// src/routes/AppRouter.tsx
import {Navigate, Route, Routes} from 'react-router-dom';

import HomePage from "../pages/home/HomePage.tsx";
import PetPage from "../pages/pet/PetPage.tsx";
import HealthcarePage from "../pages/healthcare/HealthcarePage.tsx";
import ServicesPage from "../pages/services/ServicesPage.tsx";
import ProfilePage from "../pages/profile/ProfilePage.tsx";
import SettingsPage from "../pages/settings/SettingsPage.tsx";
import LandingPage from "../pages/landing/Landing.tsx";
import VetPortalPage from "../pages/vetportal/VetPortalPage.tsx";

export const AuthenticatedRoutes = () => {
    return (
        <Routes>
            <Route path="*" element={<Navigate to="/home" />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/pets" element={<PetPage />} />
            <Route path="/healthcare" element={<HealthcarePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/vetportal" element={<VetPortalPage />} />
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