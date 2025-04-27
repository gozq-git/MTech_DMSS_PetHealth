import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {Announcement, Campaign, ChevronLeft, ChevronRight, Settings} from "@mui/icons-material";
import {styled} from "@mui/system";
import {IconButton, useTheme} from "@mui/material";
import Divider from "@mui/material/Divider";
import {NotificationSettingsModal} from "./NotificationSettingsModal.tsx";
import * as React from "react";
import {useContext, useEffect} from "react";
import {NotificationCreateModal} from "./CreateNotificationModal.tsx";
import {NotificationsListModal} from "./NotificationsListModal.tsx";
import {ApiClientContext} from "../../providers/ApiClientProvider.tsx";
import {useMsal} from "@azure/msal-react";

type NotificationDrawerProps = {
    isOpen: boolean;
    toggleDrawer: (newOpen: boolean) => void;
}

export const NotificationDrawer = ({isOpen, toggleDrawer}: NotificationDrawerProps) => {
    const theme = useTheme();
    const { instance } = useMsal();
    const activeAccount = instance.getActiveAccount();
    const { userApi } = useContext(ApiClientContext);
    const [isVet, setIsVet] = React.useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
    const [isCreateNotificationOpen, setIsCreateNotificationOpen] = React.useState(false);
    const openNotifications = () => setIsNotificationsOpen(true);
    const closeNotifications = () => setIsNotificationsOpen(false);
    const openCreateNotificationModal = () => setIsCreateNotificationOpen(true);
    const closeCreateNotificationModal = () => setIsCreateNotificationOpen(false);
    const openNotificationSettings = () => setIsSettingsOpen(true);
    const closeNotificationSettings = () => setIsSettingsOpen(false);

    useEffect(() => {
        console.info(`activeAccount: ${activeAccount}`);
        if(activeAccount) {
            const fetchUserProfile = async () => {
                try {
                    const result = await userApi.retrieveUser();
                    if (result?.success && result.data) {
                        console.info(result.data);
                        setIsVet(!!result.data.VET)
                    } else {
                        console.error(result.message);
                    }
                } catch (err) {
                    console.error(err);
                }
            };
            fetchUserProfile();
        }
    }, [activeAccount]);

    const listItems = [
        {
            text: 'Announcements',
            icon: <Announcement />,
            onClick: openNotifications
        },
        ...(isVet ? [{
            text: 'Create New Announcement',
            icon: <Campaign />,
            onClick: openCreateNotificationModal
        }] : []),
        {
            text: 'Settings',
            icon: <Settings />,
            onClick: openNotificationSettings
        }
    ]
    const DrawerList = (
        <Box sx={{width: 250}} role="presentation" onClick={() =>{}}>
            <List>
                {listItems.map((item, index) => (
                    <ListItem key={index} disablePadding>
                        <ListItemButton onClick={item.onClick}>
                            <ListItemIcon>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text}/>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );


    return (
        <div>
            <Drawer variant="persistent" anchor="right" open={isOpen} onClose={() => toggleDrawer(false)}>
                <DrawerHeader>
                    <IconButton onClick={() => toggleDrawer(!isOpen)}>
                        {theme.direction === 'rtl' ? <ChevronLeft/> : <ChevronRight />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                {DrawerList}
            </Drawer>
            <NotificationsListModal
                open={isNotificationsOpen}
                onClose={closeNotifications}
            />
            <NotificationCreateModal
                open={isCreateNotificationOpen}
                onClose={closeCreateNotificationModal}
            />
            <NotificationSettingsModal open={isSettingsOpen} handleClose={closeNotificationSettings} handleOpen={openNotificationSettings} />
        </div>
    );
}

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins,
    justifyContent: 'flex-start',
}));

