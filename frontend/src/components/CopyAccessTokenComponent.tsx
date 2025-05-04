import {useAccount, useMsal} from "@azure/msal-react";
import {useContext, useEffect, useState} from "react";
import {SNACKBAR_SEVERITY, SnackbarContext} from "../providers/SnackbarProvider.tsx";
import Box from "@mui/material/Box";
import {Button, Grid2, TextField} from "@mui/material";
import {ContentCopy, DeleteForever, Refresh} from "@mui/icons-material";
import {acquireAccessToken} from "../auth/msalService.ts";
import {msalInstance} from "../main.tsx";

export const CopyAccessTokenComponent = () => {
    /**
     * useMsal is hook that returns the PublicClientApplication instance,
     * that tells you what msal is currently doing. For more, visit:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/hooks.md
     */
    const {instance, accounts} = useMsal();
    const {showSnackbar} = useContext(SnackbarContext);
    const [accessToken, setAccessToken] = useState("")
    const account = useAccount(accounts[0] || {});

    useEffect(() => {
        retrieveAccessToken().then()
    }, [account, instance]);

    const retrieveAccessToken = async () => {
        if (account) {
            const accessToken = await acquireAccessToken(msalInstance)
            accessToken && setAccessToken("Bearer " + accessToken)
            // instance.acquireTokenSilent({
            //     scopes: ["User.Read"],
            //     account: account
            // }).then((response) => {
            //     if (response) {
            //         setAccessToken(response.accessToken)
            //     }
            // });
        }
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(accessToken)
            .then(() => {
                showSnackbar("Copied to clipboard", SNACKBAR_SEVERITY.SUCCESS);
                // Reset success message after 2 seconds
                // setTimeout(() => setCopySuccess(false), 2000);
            })
            .catch(err => {
                showSnackbar(`${err}`, SNACKBAR_SEVERITY.ERROR);
            });
    };

    const deleteAccessToken = () => {
        setAccessToken("")
    }

    return (
        <Box sx={{mt: 2}}>
            <Grid2 container spacing={1}>
                <Grid2 size={12}>
                    <TextField
                        id="access-token-field"
                        label="Access Token"
                        variant="outlined"
                        value={accessToken}
                        fullWidth
                    />
                </Grid2>
            </Grid2>
            <Grid2 container spacing={1}>
                <Grid2 size={3}>
                    {accessToken ?
                        <Button
                            onClick={deleteAccessToken}
                            variant="outlined"
                            sx={{minWidth: '40px', width: '100%'}}
                        >
                            <DeleteForever/>
                        </Button>
                        :
                        <Button
                            onClick={retrieveAccessToken}
                            variant="outlined"
                            sx={{minWidth: '40px', width: '100%'}}
                        >
                            <Refresh/>
                        </Button>
                    }
                </Grid2>

                <Grid2 size={3}>
                    <Button
                        onClick={copyToClipboard}
                        variant="contained"
                        color="primary"
                        disabled={!accessToken}
                        sx={{minWidth: '40px', width: '100%'}} // Ensure button has consistent width
                    >
                        <ContentCopy/>
                    </Button>
                </Grid2>
            </Grid2>
        </Box>
    )
}