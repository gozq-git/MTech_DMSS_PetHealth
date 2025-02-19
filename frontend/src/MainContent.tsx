import {AuthenticatedTemplate, UnauthenticatedTemplate, useMsal} from "@azure/msal-react";
import {loginRequest} from "./authConfig.ts";
import './App.css'
import LandingPage from "./pages/Landing.tsx";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import PetPage from "./pages/PetPage.tsx";
import PageLayout from "./components/PageLayout.tsx";
import HomePage from "./pages/HomePage.tsx";
import HealthcarePage from "./pages/HealthcarePage.tsx";
import ServicesPage from "./pages/ServicesPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import SettingsPage from "./pages/SettingsPage.tsx";
import {AuthenticatedRoutes, UnauthenticatedRoutes} from "./routes/AppRouter.tsx";

const MainContent = () => {
    /**
     * useMsal is hook that returns the PublicClientApplication instance,
     * that tells you what msal is currently doing. For more, visit:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/hooks.md
     */
    const {instance} = useMsal();
    const activeAccount = instance.getActiveAccount();

    const handleLoginRedirect = () => {
        instance.loginRedirect(loginRequest).catch((error) => console.log(error));
    };

    const handleLogoutRedirect = () => {
        instance.logoutRedirect().catch((error) => console.log(error));
    };

    const handleSignUpRedirect = () => {
        instance
            .loginRedirect({
                ...loginRequest,
                prompt: 'create',
            })
            .catch((error) => console.log(error));
    };
    return (
        <BrowserRouter>
            <PageLayout>
                <AuthenticatedTemplate>
                    <AuthenticatedRoutes />
                </AuthenticatedTemplate>

                <UnauthenticatedTemplate>
                    <UnauthenticatedRoutes />
                </UnauthenticatedTemplate>
            </PageLayout>
        </BrowserRouter>
    );
};

export default MainContent;