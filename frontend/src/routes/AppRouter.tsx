// src/routes/AppRouter.tsx
import {Navigate, Route, Routes} from 'react-router-dom';

import HomePage from "../pages/HomePage.tsx";
import PetPage from "../pages/PetPage.tsx";
import HealthcarePage from "../pages/HealthcarePage.tsx";
import ServicesPage from "../pages/ServicesPage.tsx";
import ProfilePage from "../pages/ProfilePage.tsx";
import SettingsPage from "../pages/SettingsPage.tsx";
import LandingPage from "../pages/Landing.tsx";

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