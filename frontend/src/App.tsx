import './App.css';
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PageLayout from './components/PageLayout.tsx';
import LandingPage from './pages/Landing.tsx';
import PetPage from './pages/PetPage.tsx';

interface AppProps {
    instance: PublicClientApplication;
}

const App = ({ instance }: AppProps) => {
    return (
        <MsalProvider instance={instance}>
            <Router>
                <PageLayout>
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/pets" element={<PetPage />} />
                    </Routes>
                </PageLayout>
            </Router>
        </MsalProvider>
    );
};

export default App;
