import './App.css';
import {PublicClientApplication} from "@azure/msal-browser";
import {MsalProvider} from "@azure/msal-react";
import MainContent from "./MainContent.tsx";
import {SnackbarProvider} from "./providers/SnackbarProvider.tsx";

interface AppProps {
    instance: PublicClientApplication;
}

const App = ({instance}: AppProps) => {
    return (
        <MsalProvider instance={instance}>
            <SnackbarProvider>
                <MainContent/>
            </SnackbarProvider>
        </MsalProvider>
    );
};

export default App;
