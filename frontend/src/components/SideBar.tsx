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
import { Button } from "@mui/material";
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
    { id: 'home', text: 'Home', icon: Home, description: 'abc', endpoint: '/home' },
    { id: 'pets', text: 'My Pets', icon: PetsIcon, description: 'abc', endpoint: '/pets' },
    { id: 'healthcare', text: 'Healthcare', icon: MedicalServices, description: 'abc', endpoint: '/healthcare' },
    { id: 'teleconsultation', text: 'Teleconsultation', icon: MedicalServices, description: 'abc', endpoint: '/teleconsultation' },
    { id: 'services', text: 'Other Services', icon: AutoAwesome, description: 'abc', endpoint: '/services' }
];

const vetSideBarItems: SideBarItem[] = [
    { id: 'vet-home', text: 'Vet Dashboard', icon: Home, description: 'abc', endpoint: '/vet/home' },
    { id: 'vet-pets', text: 'Patient Records', icon: PetsIcon, description: 'abc', endpoint: '/vet/pets' },
    { id: 'vet-healthcare', text: 'Vet Healthcare', icon: MedicalServices, description: 'abc', endpoint: '/vet/healthcare' },
    { id: 'vet-services', text: 'Vet Services', icon: AutoAwesome, description: 'abc', endpoint: '/vet/services' }
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
            sx={{ '& .MuiDrawer-paper': { width: drawerWidth } }}
        >
            <Toolbar>
                <IconButton onClick={onClose}>
                    <ChevronLeftIcon />
                </IconButton>
            </Toolbar>
            <Divider />
            {activeAccount ? (
                <List>
                    {computedItems.map((item) => (
                        <ListItem key={item.id} disablePadding>
                            <SideBarButton item={item} onClick={() => handleNavigation(item.endpoint)} />
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Button onClick={() => instance.loginRedirect(loginRequest)}>Login to Access Features</Button>
            )}
        </Drawer>
    );
};

export default SideBar;
