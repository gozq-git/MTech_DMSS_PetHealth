import {AuthenticatedTemplate, UnauthenticatedTemplate, useMsal} from "@azure/msal-react";
import {loginRequest} from "src/authConfig";
import 'src/App.css'

const MainContent = () => {
    /**
     * useMsal is hook that returns the PublicClientApplication instance,
     * that tells you what msal is currently doing. For more, visit:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/hooks.md
     */
    const { instance } = useMsal();
    const activeAccount = instance.getActiveAccount();

    const handleLoginRedirect = () => {
        instance.loginRedirect(loginRequest).catch((error: Error) => console.log(error));
    };

    const handleLogoutRedirect = () => {
        instance.logoutRedirect().catch((error: Error) => console.log(error));
    };

    const handleSignUpRedirect = () => {
        instance
            .loginRedirect({
            ...loginRequest,
            prompt: 'create',
            })
            .catch((error: Error) => console.log(error));
    };
    return (
        <div className="App">
            <AuthenticatedTemplate>
                {activeAccount ? (
                    <>
                        <h1>Vite + React</h1>
                        <div className="card">
                            <button type="button" onClick={handleLogoutRedirect}>
                                Log out
                            </button>
                        </div>
                    </>
                ) : null}
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
                <button type="button" onClick={handleSignUpRedirect}>
                    Sign up
                </button>
                <button type="button" onClick={handleLoginRedirect}>
                    Sign In
                </button>
            </UnauthenticatedTemplate>
        </div>
    );
};

export default MainContent;