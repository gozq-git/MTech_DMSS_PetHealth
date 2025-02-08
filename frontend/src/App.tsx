import './App.css'
import {PublicClientApplication} from "@azure/msal-browser";
import {MsalProvider} from "@azure/msal-react";
// import MainContent from "./MainContent.tsx";
import PageLayout from './components/PageLayout.tsx';
import LandingPage from './pages/Landing.tsx';


interface AppProps {
    instance: PublicClientApplication
}

const App = ({instance} : AppProps) =>{
    return (
        <MsalProvider instance={instance}>
            <PageLayout>
                <LandingPage/>
                {/* <MainContent/> */}
            </PageLayout>
        </MsalProvider>
    )
}

export default App
