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

    // useEffect(() => {
    //     if (!activeAccount) return;
    
    //     const fetchUsers = async () => {
    //         try {
    //             const users = await userApi.getUsers();
    
    //             const loggedInUser = users.find(
    //                 (user) => user.ID?.trim() === activeAccount.username.trim()
    //             );
    
    //             if (!loggedInUser) {
    //                 console.warn("User not found in system.");
    //                 return;
    //             }
    
    //             console.log("Logged in user:", loggedInUser);
    
    //             navigate(loggedInUser.ACCOUNT_TYPE === null ? "/profile" : "/pets");
    //         } catch (error) {
    //             console.error("Failed to fetch users:", error);
    //         }
    //     };
    
    //     fetchUsers();
    // }, [activeAccount, navigate, userApi]);
    
    

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