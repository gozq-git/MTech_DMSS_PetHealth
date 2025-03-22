import {AuthenticatedTemplate, UnauthenticatedTemplate} from "@azure/msal-react";
import './App.css'
import PageLayout from "./components/PageLayout.tsx";
import {AuthenticatedRoutes, UnauthenticatedRoutes} from "./routes/AppRouter.tsx";

const MainContent = () => {
    return (
        <PageLayout>
            <AuthenticatedTemplate>
                <AuthenticatedRoutes/>
            </AuthenticatedTemplate>

            <UnauthenticatedTemplate>
                <UnauthenticatedRoutes/>
            </UnauthenticatedTemplate>
        </PageLayout>
    );
};

export default MainContent;