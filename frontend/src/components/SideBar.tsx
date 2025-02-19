import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import PetsIcon from '@mui/icons-material/Pets';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import {useNavigate} from 'react-router-dom';
import {useMsal} from "@azure/msal-react";
import {Button} from "@mui/material";
import {loginRequest} from "../authConfig.ts";
import {AutoAwesome, Home, MedicalServices, SvgIconComponent} from "@mui/icons-material";
import {SideBarButton} from "./SideBarButton.tsx";

const drawerWidth = 240;

interface SideBarProps {
    isOpen: boolean;
    onClose: () => void;
}

export interface SideBarItem {
    id: String,
    text: String,
    description: String,
    icon: SvgIconComponent,
    endpoint: String
}

const sideBarItems: SideBarItem[] = [
    {
        id: 'home',
        text: 'Home',
        description: 'Navigate to Home',
        icon: Home,
        endpoint: '/home'
    },
    {
        id: 'pets',
        text: 'My Pets',
        description: 'View my Pets',
        icon: PetsIcon,
        endpoint: '/pets'
    },
    {
        id: 'healthcare',
        text: 'Healthcare',
        description: 'Medical and Healthcare Services',
        icon: MedicalServices,
        endpoint: '/healthcare'
    },
    {
        id: 'services',
        text: 'Other Services',
        description: 'Other Services',
        icon: AutoAwesome,
        endpoint: '/services'
    }
];

const SideBar = ({isOpen, onClose}: SideBarProps) => {
    const navigate = useNavigate();
    const handleNavigation = (endpoint: String) => {
        navigate(endpoint.toString()); // Convert String to string if needed
    }
    const {instance} = useMsal();
    const activeAccount = instance.getActiveAccount();
    const handleLoginRedirect = () => {
        instance.loginRedirect(loginRequest).catch((error) => console.log(error));
    };
    return (
        <Drawer
            variant="temporary"
            open={isOpen}
            onClose={onClose}
            sx={{'& .MuiDrawer-paper': {width: drawerWidth}}}
        >
            <Toolbar>
                <IconButton onClick={onClose}>
                    <ChevronLeftIcon/>
                </IconButton>
            </Toolbar>
            <Divider/>
            {
                activeAccount ?
                    <List>
                        {sideBarItems.map((item) => (
                            <ListItem key={String(item.id)} disablePadding>
                                <SideBarButton
                                    item={item}
                                    onClick={handleNavigation}
                                />
                            </ListItem>
                        ))}
                    </List>
                    :
                    <Button onClick={handleLoginRedirect}>Login to Access Features</Button>
            }
            <Divider/>
            <List>

            </List>
        </Drawer>
    );
};

export default SideBar;
