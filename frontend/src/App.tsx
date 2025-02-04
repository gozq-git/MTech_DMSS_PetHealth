import './App.css'
import {PublicClientApplication} from "@azure/msal-browser";
import {MsalProvider} from "@azure/msal-react";
import MainContent from "./MainContent.tsx";

interface AppProps {
    instance: PublicClientApplication
}
const App = ({instance} : AppProps) =>{
    return (
        <MsalProvider instance={instance}>
            {/*<PageLayout>*/}
                <MainContent/>
            {/*</PageLayout>*/}
        </MsalProvider>
    )
}

export default App
