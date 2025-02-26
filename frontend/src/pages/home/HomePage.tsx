import {Container} from "@mui/material";
import Box from "@mui/material/Box";
import {UserProfileForm} from "../profile/UserProfileForm.tsx";
import {useMsal} from "@azure/msal-react";
import HomePageContent from "./HomePageContent.tsx";
import {useContext, useEffect} from "react";
import {SNACKBAR_SEVERITY, SnackbarContext} from "../../providers/SnackbarProvider.tsx";
import {ApiClientContext} from "../../providers/ApiClientProvider.tsx";

const HomePage = () => {
    const {instance} = useMsal();
    const activeAccount = instance.getActiveAccount();
    const {showSnackbar} = useContext(SnackbarContext);
    const {userApi} = useContext(ApiClientContext);

    useEffect(() => {
        userApi.getUsers().then(result => {
                showSnackbar(result.toString(), SNACKBAR_SEVERITY.INFO)
                console.log(result)
            }
        ).catch(reason => console.log(reason.toString()));
    }, [])

    console.log({...activeAccount});
    return (<Container maxWidth="lg">
        <Box sx={{display: 'flex', flexDirection: 'column'}}>
            {activeAccount ? <HomePageContent/> : <UserProfileForm/>}
        </Box>
    </Container>)

}

export default HomePage;
