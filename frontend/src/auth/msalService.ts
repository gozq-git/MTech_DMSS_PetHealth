import {PublicClientApplication} from "@azure/msal-browser";

/**
 * Acquires an access token for the authenticated user
 *
 * This function attempts to silently acquire an access token using MSAL.
 * It requires an active account (a user who has already signed in).
 *
 * @param msalInstance - The PublicClientApplication instance used for authentication
 * @returns A Promise that resolves to the access token string
 * @throws Error if no active account is found or token acquisition fails
 * @author xueyang
 * @example
 * // Get the access token
 * try {
 *   const token = await acquireAccessToken(msalInstance);
 *   // Use token for API calls
 * } catch (error) {
 *   // Handle authentication errors
 *   console.error("Failed to acquire token:", error);
 * }
 */
export const acquireAccessToken = async (msalInstance: PublicClientApplication) => {
    const activeAccount = msalInstance.getActiveAccount(); // This will only return a non-null value if you have logic somewhere else that calls the setActiveAccount API
    const accounts = msalInstance.getAllAccounts();

    if (!activeAccount && accounts.length === 0) {
        console.error("No active account found");
        /*
        * User is not signed in. Throw error or wait for user to login.
        * Do not attempt to log a user in outside of the context of MsalProvider
        */
    }
    const request = {
        scopes: ["User.Read"],
        account: activeAccount || accounts[0]
    };

    const authResult = await msalInstance.acquireTokenSilent(request);

    return authResult.accessToken
};