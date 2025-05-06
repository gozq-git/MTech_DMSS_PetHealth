import {Container} from "@mui/material";
import Box from "@mui/material/Box";
import HomePageContent from "./HomePageContent.tsx";

const HomePage = () => {
    return (<Container maxWidth="lg">
        <Box sx={{display: 'flex', flexDirection: 'column'}}>
            <HomePageContent/>
        </Box>
    </Container>)

}

export default HomePage;
