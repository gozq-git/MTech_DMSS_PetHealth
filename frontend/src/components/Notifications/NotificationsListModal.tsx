import React, {useEffect, useState} from 'react';
import {
    Alert,
    Avatar,
    Box,
    Button,
    Chip,
    CircularProgress,
    Divider,
    IconButton,
    InputAdornment,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Modal,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import {Announcement, Close, Refresh, Search,} from '@mui/icons-material';

interface Notification {
    id: string;
    title: string;
    message: string;
    category: string;
    priority: 'high' | 'normal' | 'low';
    recipientType: 'all' | 'specific';
    createdAt: string;
    createdBy: {
        name: string;
        avatar?: string;
    };
    recipients?: {
        total: number;
        read: number;
    };
}

interface NotificationsListModalProps {
    open: boolean;
    onClose: () => void;
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    maxHeight: '90vh',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
};

export const NotificationsListModal: React.FC<NotificationsListModalProps> = ({open, onClose}) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
    const handleRefresh = () => {
        // Handle refresh logic here
        console.log('Refreshing notifications');
    };

    // Sample data - replace with actual API call
    const fetchNotifications = async () => {
        setLoading(true);
        setError(null);
        try {
            // Simulate API call - replace with actual API call
            const response = mockNotificationsResponse;
            setNotifications(response);
        } catch (err) {
            setError('Failed to fetch notifications. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            fetchNotifications();
        }
    }, [open]);

    useEffect(() => {
        let filtered = notifications;

        // Apply search
        if (searchQuery) {
            filtered = filtered.filter(n =>
                n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                n.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                n.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredNotifications(filtered);
    }, [notifications, searchQuery]);


    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'error';
            case 'normal':
                return 'primary';
            case 'low':
                return 'success';
            default:
                return 'default';
        }
    };

    const getRecipientCount = (notification: Notification) => {
        if (notification.recipientType === 'all') {
            return `${notification.recipients?.read || 0}/${notification.recipients?.total || 0} read`;
        }
        return 'Direct message';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="notifications-list-modal"
            aria-describedby="view-all-notifications"
        >
            <Box sx={style}>
                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3}}>
                    <Typography variant="h5" component="h2">
                        Notifications
                    </Typography>
                    <IconButton onClick={onClose} size="small">
                        <Close/>
                    </IconButton>
                </Box>

                {error && (
                    <Alert severity="error" sx={{mb: 2}} onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                <Stack direction="row" spacing={2} sx={{mb: 3}}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search notifications..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search/>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Stack>

                {loading ? (
                    <Box sx={{display: 'flex', justifyContent: 'center', py: 4}}>
                        <CircularProgress/>
                    </Box>
                ) : filteredNotifications.length === 0 ? (
                    <Typography variant="body1" color="text.secondary" align="center" sx={{py: 4}}>
                        No notifications found
                    </Typography>
                ) : (
                    <List sx={{width: '100%', bgcolor: 'background.paper'}}>
                        {filteredNotifications.map((notification, index) => (
                            <React.Fragment key={notification.id}>
                                <ListItem
                                    alignItems="flex-start"
                                    sx={{
                                        '&:hover': {
                                            bgcolor: 'action.selected',
                                        },
                                    }}
                                >
                                    <ListItemAvatar>
                                        <Avatar src={notification.createdBy.avatar}>
                                            <Announcement/>
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                                <Typography variant="subtitle1" component="span">
                                                    {notification.title}
                                                </Typography>
                                                <Chip
                                                    label={notification.priority}
                                                    size="small"
                                                    color={getPriorityColor(notification.priority)}
                                                />
                                                <Chip
                                                    label={notification.category.replace('-', ' ')}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            </Box>
                                        }
                                        secondary={
                                            <>
                                                <Typography
                                                    component="span"
                                                    variant="body2"
                                                    color="text.primary"
                                                    sx={{display: 'block', mb: 1}}
                                                >
                                                    {notification.message}
                                                </Typography>
                                                <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                                    <Typography component="span" variant="caption"
                                                                color="text.secondary">
                                                        By {notification.createdBy.name}
                                                    </Typography>
                                                    <Typography component="span" variant="caption"
                                                                color="text.secondary">
                                                        •
                                                    </Typography>
                                                    <Typography component="span" variant="caption"
                                                                color="text.secondary">
                                                        {formatDate(notification.createdAt)}
                                                    </Typography>
                                                    <Typography component="span" variant="caption"
                                                                color="text.secondary">
                                                        •
                                                    </Typography>
                                                    <Typography component="span" variant="caption"
                                                                color="text.secondary">
                                                        {getRecipientCount(notification)}
                                                    </Typography>
                                                </Box>
                                            </>
                                        }
                                    />
                                </ListItem>
                                {index < filteredNotifications.length - 1 && <Divider variant="inset" component="li"/>}
                            </React.Fragment>
                        ))}
                    </List>
                )}

                <Box sx={{mt: 3, display: 'flex', justifyContent: 'space-between'}}>
                    <Button onClick={handleRefresh} startIcon={<Refresh/>}>
                        Refresh
                    </Button>
                    <Button onClick={onClose}>
                        Close
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

const mockNotificationsResponse = [
    {
        id: '1',
        title: 'Emergency Alert: Pet Vaccination Required',
        message: 'Please ensure your pet is vaccinated against rabies within the next 30 days.',
        category: 'health-advisory',
        priority: 'high' as const,
        recipientType: 'all' as const,
        createdAt: '2024-01-15T10:30:00Z',
        createdBy: {
            name: 'AVS',
            avatar: '/api/placeholder/40/40'
        },
    },
    {
        id: '2',
        title: 'Appointment Reminder',
        message: 'Your pet Kiyo has a checkup scheduled for tomorrow at 2 PM.',
        category: 'appointment-reminder',
        priority: 'normal' as const,
        recipientType: 'specific' as const,
        createdAt: '2024-01-14T14:00:00Z',
        createdBy: {
            name: 'Barkway',
        },
    },
    {
        id: '3',
        title: `It's that time of the year again..`,
        message: 'As monsoon clouds gather, here are some tips to keep your furkids healthy in the wet season',
        category: 'pet-care',
        priority: 'low' as const,
        recipientType: 'all' as const,
        createdAt: '2024-01-13T09:15:00Z',
        createdBy: {
            name: 'AVS',
            avatar: '/api/placeholder/40/40'
        },
    },
]