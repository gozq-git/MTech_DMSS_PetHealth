import {AuthenticatedTemplate, UnauthenticatedTemplate, useMsal} from "@azure/msal-react";
import {loginRequest} from "./authConfig.ts";
import { useEffect, useState, useContext } from "react";
import './App.css'
import {useNavigate} from "react-router-dom";
import PageLayout from "./components/PageLayout.tsx";
import {AuthenticatedRoutes, UnauthenticatedRoutes} from "./routes/AppRouter.tsx";
import { ApiClientContext } from "./providers/ApiClientProvider.tsx";

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

    const navigate = useNavigate(); 
    const { userApi } = useContext(ApiClientContext); 

    useEffect(() => {
        if (!activeAccount) return;
    
        const fetchUser = async () => {
            try {
                // Use the retrieveUser API to get the specific user directly
                const loggedInUser = await userApi.retrieveUser();
    
                if (!loggedInUser) {
                    // If the user is not found, redirect to the profile page
                    console.warn("User not found in system. Redirecting to profile page.");
                    navigate("/profile");
                    return;
                }
    
                // If the user is found, redirect to the pets page
                console.log("Logged in user:", loggedInUser);
                navigate("/pets");
            } catch (error) {
                console.error("Failed to fetch user:", error);
                // In case of an error, redirect to the profile page
                navigate("/profile");
            }
        };
    
        fetchUser();
    }, [activeAccount, navigate, userApi]);
    

    return (
        <PageLayout>
            <AuthenticatedTemplate>
                <AuthenticatedRoutes />
            </AuthenticatedTemplate>

            <UnauthenticatedTemplate>
                <UnauthenticatedRoutes />
            </UnauthenticatedTemplate>
        </PageLayout>
    );
};

export default MainContent;