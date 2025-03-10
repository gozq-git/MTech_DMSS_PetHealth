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
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import {useNavigate} from "react-router-dom";
import {ROUTES} from "../routes/routes.ts";

interface HeaderBarProps {
  onMenuClick: () => void;
}

const HeaderBar = ({ onMenuClick }: HeaderBarProps) => {
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();
  const navigate = useNavigate();
  const handleNavigation = (endpoint: String) => {
    navigate(endpoint.toString()); // Convert String to string if needed
  }
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogin = () => {
    instance.loginRedirect(loginRequest).catch(console.error);
  };

  const handleSignUp = () => {
    instance.loginRedirect({ ...loginRequest, prompt: 'create' }).catch(console.error);
  };

  const handleLogout = () => {
    instance.logoutRedirect().catch(console.error);
  };

  const handleProfile = () => {
    handleNavigation(ROUTES.PROFILE.path);
    handleClose();
  };

  const handleSettings = () => {
    handleNavigation(ROUTES.SETTINGS.path);
    handleClose();
  };

  const handleVetPortal = () => {
    handleNavigation(ROUTES.VET_PORTAL.path);
    handleClose();
  };

  return (
      <AppBar position="fixed" sx={{ backgroundColor: '#795548' }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={onMenuClick} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <PetsIcon sx={{ mr: 1 }} />
          <Typography variant="h6" noWrap>
            Pet Health Platform
          </Typography>
          <div style={{ marginLeft: 'auto' }}>
            <IconButton color="inherit" onClick={handleMenu}>
              <AccountCircle />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
              {activeAccount ? (
                  <>
                    <Box sx={{ px: 2, py: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar
                            sx={{ width: 40, height: 40, mr: 2 }}
                            src={activeAccount.username ? `https://api.dicebear.com/9.x/pixel-art/svg` : undefined}
                        />
                        <Box>
                          <Typography variant="subtitle1">
                            {activeAccount.name || 'User'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {activeAccount.username || activeAccount.localAccountId}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Divider />
                    <MenuItem onClick={handleProfile}>Profile</MenuItem>
                    <MenuItem onClick={handleSettings}>Settings</MenuItem>
                    <MenuItem onClick={handleVetPortal}>Vet Portal</MenuItem>
                    <Divider />
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
  );
};

export default HeaderBar;