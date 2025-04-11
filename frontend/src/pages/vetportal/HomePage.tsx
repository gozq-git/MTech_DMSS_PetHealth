import {Container} from "@mui/material";
import Box from "@mui/material/Box";
import HomePageContent from "../home/HomePageContent.tsx";

const VetHomePage = () => {
    return (<Container maxWidth="lg">
        <Box sx={{display: 'flex', flexDirection: 'column'}}>
            <HomePageContent/>
        </Box>
    </Container>)

}

export default VetHomePage;
