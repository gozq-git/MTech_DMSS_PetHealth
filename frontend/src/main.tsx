import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {PublicClientApplication,EventType} from "@azure/msal-browser";
import { msalConfig } from './authConfig.ts';
/**
 * MSAL should be instantiated outside of the component tree to prevent it from being re-instantiated on re-renders.
 * For more, visit: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/getting-started.md
 */
const msalInstance = new PublicClientApplication(msalConfig);

// Default to using the first account if no account is active on page load
if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
    // Account selection logic is app dependent. Adjust as needed for different use cases.
    msalInstance.setActiveAccount(msalInstance.getActiveAccount());
}

// Listen for sign-in event and set active account
msalInstance.addEventCallback((event) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload && 'account' in event.payload) {
        const account = event.payload?.account;
        if (account) {
            msalInstance.setActiveAccount(account);
        } else {
            msalInstance.setActiveAccount(null);
        }
    }
});
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App instance={msalInstance}/>
  </StrictMode>,
)
