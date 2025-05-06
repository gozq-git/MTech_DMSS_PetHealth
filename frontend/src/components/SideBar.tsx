import { useContext } from "react";
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import PetsIcon from '@mui/icons-material/Pets';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useNavigate } from 'react-router-dom';
import { useMsal } from "@azure/msal-react";
import { Button, Box, Typography } from "@mui/material";
import { loginRequest } from "../authConfig.ts";
import { AutoAwesome, Home, MedicalServices } from "@mui/icons-material";
import { SideBarButton } from "./SideBarButton.tsx";
import { AccountTypeContext } from "../contexts/AccountTypeContext";

const drawerWidth = 240;

export interface SideBarItem {
    id: string;
    text: string;
    description: string;
    icon: React.ElementType;
    endpoint: string;
}

const userSideBarItems: SideBarItem[] = [
    { id: 'home', text: 'Home', icon: Home, description: 'Home', endpoint: '/home' },
    { id: 'pets', text: 'My Pets', icon: PetsIcon, description: 'My Pets', endpoint: '/pets' },
    { id: 'healthcare', text: 'Teleconsultation', icon: MedicalServices, description: 'Teleconsultation', endpoint: '/healthcare' }
];

const vetSideBarItems: SideBarItem[] = [
    { id: 'vet-home', text: 'Vet Home', icon: Home, description: 'Vet Home', endpoint: '/vet/home' },
    { id: 'vet-pets', text: 'Patient Records', icon: PetsIcon, description: 'Patient Records', endpoint: '/vet/pets' },
    { id: 'vet-healthcare', text: 'Teleconsultation', icon: MedicalServices, description: 'Teleconsultation', endpoint: '/vet/healthcare' }
];

const SideBar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const navigate = useNavigate();
    const { instance } = useMsal();
    const activeAccount = instance.getActiveAccount();
    const { accountType } = useContext(AccountTypeContext);

    const computedItems = accountType === "vet" ? vetSideBarItems : userSideBarItems;

    const handleNavigation = (endpoint: string) => {
        navigate(endpoint);
        onClose(); // Close sidebar when navigating
    };

    return (
        <Drawer
            variant="temporary"
            open={isOpen}
            onClose={onClose}
            sx={{
                '& .MuiDrawer-paper': { 
                    width: drawerWidth, 
                    backgroundColor: '#f4f4f9', 
                    borderRight: '2px solid #ccc',
                    boxShadow: '3px 0 10px rgba(0, 0, 0, 0.1)',
                },
            }}
        >
            <Toolbar>
                <IconButton onClick={onClose}>
                    <ChevronLeftIcon sx={{ color: '#2196F3' }} />
                </IconButton>
            </Toolbar>
            <Divider />
            <Box sx={{ padding: 2 }}>
                {activeAccount ? (
                    <List>
                        {computedItems.map((item) => (
                            <ListItem key={item.id} disablePadding>
                                <SideBarButton item={item} onClick={() => handleNavigation(item.endpoint)} />
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Box sx={{ textAlign: 'center', marginTop: 2 }}>
                        <Typography variant="h6" color="text.secondary" sx={{ marginBottom: 1 }}>
                            Please log in to access features
                        </Typography>
                        <Button
                            onClick={() => instance.loginRedirect(loginRequest)}
                            variant="contained"
                            sx={{ width: '100%', backgroundColor: '#00897B', color: 'white' }}
                        >
                            Login
                        </Button>
                    </Box>
                )}
            </Box>
        </Drawer>
    );
};

export default SideBar;
