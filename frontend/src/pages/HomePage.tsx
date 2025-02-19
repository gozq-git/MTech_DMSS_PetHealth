import {Container} from "@mui/material";
import Box from "@mui/material/Box";
import {UserProfileForm} from "./UserProfileForm.tsx";
import {useMsal} from "@azure/msal-react";
import HomePageContent from "./HomePageContent.tsx";

const HomePage = () => {
    const {instance} = useMsal();
    const activeAccount = instance.getActiveAccount();
    console.log({...activeAccount});
    return (<Container maxWidth="lg">
        <Box sx={{display: 'flex', flexDirection: 'column'}}>
            {activeAccount ? <HomePageContent/> : <UserProfileForm/>}
        </Box>
    </Container>)

}

export default HomePage;
