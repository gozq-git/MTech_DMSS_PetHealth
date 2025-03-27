// App.tsx or MainContent.tsx
import { AccountTypeProvider } from "./contexts/AccountTypeContext";
import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import './App.css'
import PageLayout from "./components/PageLayout.tsx";
import { AuthenticatedRoutes, UnauthenticatedRoutes } from "./routes/AppRouter.tsx";

const MainContent = () => {
  return (
    <AccountTypeProvider>
      <PageLayout>
        <AuthenticatedTemplate>
          <AuthenticatedRoutes />
        </AuthenticatedTemplate>

        <UnauthenticatedTemplate>
          <UnauthenticatedRoutes />
        </UnauthenticatedTemplate>
      </PageLayout>
    </AccountTypeProvider>
  );
};

export default MainContent;
