import React, {useState} from "react";
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import HeaderBar from "./HeaderBar";
import SideBar from "./SideBar";
import {NotificationDrawer} from "./Notifications/NotificationDrawer.tsx";

interface PageLayoutProps {
    children: React.ReactNode;
}

const PageLayout = ({children}: PageLayoutProps) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleDrawerToggle = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };
    const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = React.useState(false);
    const toggleNotificationDrawer = () => {
        setIsNotificationDrawerOpen(!isNotificationDrawerOpen);
    }
    return (
        <Box sx={{display: 'flex'}}>
            <CssBaseline/>
            <HeaderBar onMenuClick={handleDrawerToggle} onNotificationDrawerClick={toggleNotificationDrawer} />
            <SideBar isOpen={isDrawerOpen} onClose={handleDrawerToggle}/>
            <NotificationDrawer isOpen={isNotificationDrawerOpen} toggleDrawer={toggleNotificationDrawer}/>
            <Box component="main" sx={{flexGrow: 1, p: 3}}>
                <Toolbar/>
                <Typography>
                    {children}
                </Typography>
            </Box>
        </Box>
    );
};

export default PageLayout;
