import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import AccountCircle from '@mui/icons-material/AccountCircle';
import PetsIcon from '@mui/icons-material/Pets';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import {useMsal} from "@azure/msal-react";
import {loginRequest} from "../authConfig";
import {useNavigate} from "react-router-dom";
import {ROUTES} from "../routes/routes.ts";
import {AccountTypeContext} from "../contexts/AccountTypeContext";
import {CopyAccessTokenComponent} from "./CopyAccessTokenComponent.tsx";
import {Mail} from "@mui/icons-material";

interface HeaderBarProps {
    onMenuClick: () => void;
    onNotificationDrawerClick: () => void;
}

const HeaderBar = ({onMenuClick, onNotificationDrawerClick}: HeaderBarProps) => {
    const {instance} = useMsal();
    const activeAccount = instance.getActiveAccount();
    const navigate = useNavigate();
    const {accountType, setAccountType} = React.useContext(AccountTypeContext);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleNavigation = (path: string) => {
        navigate(path);
        handleClose();
    };

    const handleToggleVetMode = () => {
        if (accountType === "vet") {
            setAccountType("user");
            navigate("/home");  // Redirect to user home
        } else {
            setAccountType("vet");
            navigate("/vetportal");  // Redirect to vet portal
        }
        handleClose();
    };

    const handleLogin = () => {
        instance.loginRedirect(loginRequest).catch(console.error);
    };

    const handleSignUp = () => {
        instance.loginRedirect({...loginRequest, prompt: 'create'}).catch(console.error);
    };

    const handleLogout = () => {
        instance.logoutRedirect().catch(console.error);
    };

    return (
        <>
            <AppBar position="fixed" sx={{backgroundColor: '#00897B', boxShadow: 3}}>
                <Toolbar>
                    <IconButton color="inherit" edge="start" onClick={onMenuClick} sx={{mr: 2}}>
                        <MenuIcon/>
                    </IconButton>
                    <PetsIcon sx={{color: 'white', mr: 1}}/>
                    <Typography variant="h6" sx={{color: 'white', fontWeight: 'bold'}} noWrap>
                        Pet Health Platform
                    </Typography>
                    <div style={{marginLeft: 'auto'}}>
                        {activeAccount &&
                            <IconButton color="inherit" onClick={onNotificationDrawerClick}
                                        sx={{'&:hover': {transform: 'scale(1.1)', transition: 'transform 0.2s'}}}>
                                <Mail/>
                            </IconButton>
                        }
                        <IconButton color="inherit" onClick={handleMenu}
                                    sx={{'&:hover': {transform: 'scale(1.1)', transition: 'transform 0.2s'}}}>
                            <AccountCircle/>
                        </IconButton>
                        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                            {activeAccount ? (
                                <>
                                    {/* User Avatar and Info */}
                                    <Box sx={{px: 2, py: 1}}>
                                        <Box sx={{display: 'flex', alignItems: 'center', mb: 1}}>
                                            <Avatar sx={{width: 40, height: 40, mr: 2}}/>
                                            <Box>
                                                <Typography variant="subtitle1" sx={{fontWeight: 'bold'}}>
                                                    {activeAccount.name || 'User'}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {activeAccount.username || activeAccount.localAccountId}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>

                                    {/* Show access token in DEV mode */}
                                    {import.meta.env.DEV && <MenuItem><CopyAccessTokenComponent/></MenuItem>}

                                    <Divider sx={{my: 1}}/>

                                    {/* Profile & Settings */}
                                    <MenuItem onClick={() => handleNavigation(ROUTES.PROFILE.path)}>
                                        Profile
                                    </MenuItem>
                                    <MenuItem onClick={() => handleNavigation(ROUTES.SETTINGS.path)}>
                                        Settings
                                    </MenuItem>

                                    <Divider sx={{my: 1}}/>

                                    {/* Vet Mode Toggle */}
                                    <MenuItem onClick={handleToggleVetMode}>
                                        {accountType === "vet" ? "Switch to User Mode" : "Go to Vet Portal"}
                                    </MenuItem>

                                    <Divider sx={{my: 1}}/>

                                    {/* Logout */}
                                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                                </>
                            ) : (
                                <>
                                    <MenuItem onClick={handleLogin}>Sign In</MenuItem>
                                    <MenuItem onClick={handleSignUp}>Sign Up</MenuItem>
                                </>
                            )}
                        </Menu>
                    </div>
                </Toolbar>
            </AppBar>
        </>
    );
};

export default HeaderBar;
