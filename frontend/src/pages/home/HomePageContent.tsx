import {useMsal} from "@azure/msal-react";
import {Container} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const HomePageContent = () => {
    /**
     * TODO: Replace the useMsal hook with a auth context provider
     */
    const {instance} = useMsal();
    const activeAccount = instance.getActiveAccount();
    return (
        <Container>
            <Box sx={{display: 'flex', flexDirection: 'column'}}>
                <Typography variant="h5" component="div">
                    Welcome back, {activeAccount?.username}
                </Typography>
            </Box>
        </Container>
    )
}

export default HomePageContent;