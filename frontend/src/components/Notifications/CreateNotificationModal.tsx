import React, {useContext, useState} from 'react';
import {
    Alert,
    Autocomplete,
    Box,
    Button,
    Chip,
    FormControl,
    FormControlLabel,
    Grid2,
    IconButton,
    InputLabel,
    MenuItem,
    Modal,
    Radio,
    RadioGroup,
    Select,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import {Close, Send} from '@mui/icons-material';
import {ApiClientContext} from "../../providers/ApiClientProvider.tsx";
import {SNACKBAR_SEVERITY, SnackbarContext} from "../../providers/SnackbarProvider.tsx";

interface User {
    id: string;
    name: string;
    email: string;
    isPetOwner: boolean;
}

interface NotificationFormData {
    title: string;
    message: string;
    recipientType: 'all' | 'specific';
    selectedUsers: User[];
    priority: 'high' | 'normal' | 'low';
    category: string;
}

interface NotificationCreateModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit?: (data: NotificationFormData) => void;
    availableUsers?: User[];
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    maxHeight: '90vh',
    overflowY: 'auto',
};

export const NotificationCreateModal: React.FC<NotificationCreateModalProps> = ({
                                                                                    open,
                                                                                    onClose
                                                                                }) => {
    const {notificationApi} = useContext(ApiClientContext);
    const {showSnackbar} = useContext(SnackbarContext);
    const [formData, setFormData] = useState<NotificationFormData>({
        title: '',
        message: '',
        recipientType: 'all',
        selectedUsers: [],
        priority: 'normal',
        category: 'general',
    });

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const categories = [
        'general',
        'health-advisory',
        'pet-care',
        'appointment-reminder',
        'emergency',
        'consultation-follow-up',
    ];

    const handleInputChange = (field: keyof NotificationFormData, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
        setError(null); // Clear error when user makes changes
    };

    const validateForm = (): boolean => {
        if (!formData.title.trim()) {
            setError('Title is required');
            return false;
        }
        if (!formData.message.trim()) {
            setError('Message is required');
            return false;
        }
        if (formData.recipientType === 'specific' && formData.selectedUsers.length === 0) {
            setError('Please select at least one recipient');
            return false;
        }
        return true;
    };

    const resetForm = () => {
        setFormData({
            title: '',
            message: '',
            recipientType: 'all',
            selectedUsers: [],
            priority: 'normal',
            category: 'general',
        });
    }

    const handleSubmit = async () => {
        if (!validateForm()) return;
        setLoading(true);
        try {
            if (formData.recipientType === 'specific') {
                let response;
                if(formData.selectedUsers.length === 1) {
                    response = await notificationApi.sendNotification({
                        to: formData.selectedUsers[0].email,
                        subject: formData.title,
                        message: formData.message,
                        engines: ["ntfy"]
                    });
                } else if(formData.selectedUsers.length > 1) {
                    response = await notificationApi.broadcast({
                        recipients: formData.selectedUsers.map((user) => user.email),
                        subject: formData.title,
                        message: formData.message,
                        engines: ["ntfy"]
                    });
                } else {
                    // Handle selectedUsers is empty
                    showSnackbar(
                        "No recipients selected",
                        SNACKBAR_SEVERITY.ERROR
                    );
                    setLoading(false);
                    return;
                }

                // Now response is guaranteed to be defined
                showSnackbar(
                    response.message,
                    response.success ? SNACKBAR_SEVERITY.SUCCESS : SNACKBAR_SEVERITY.ERROR
                );
            } else if (formData.recipientType === 'all') {
                const response = await notificationApi.broadcast({
                    recipients: formData.selectedUsers.map((user) => user.email),
                    subject: formData.title,
                    message: formData.message,
                    engines: ["ntfy"]
                });
                showSnackbar(
                    response.message,
                    response.success ? SNACKBAR_SEVERITY.SUCCESS : SNACKBAR_SEVERITY.ERROR
                );
            } else {
                console.warn("Invalid recipient type");
                showSnackbar(
                    "Invalid recipient type",
                    SNACKBAR_SEVERITY.ERROR
                );
            }
        } catch (err) {
            setError('Failed to send notification. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getPriorityColor = (priority: string): "error" | "primary" | "success" | "inherit" | "info" | "warning" | "secondary" => {
        switch (priority) {
            case 'high':
                return 'error';
            case 'normal':
                return 'primary';
            case 'low':
                return 'success';
            default:
                return 'primary';
        }
    };

    function closeAndResetForm() {
        resetForm();
        onClose();
    }

    return (
        <>
            <Modal
                open={open}
                onClose={onClose}
                aria-labelledby="create-notification-modal"
                aria-describedby="create-and-send-notification-to-users"
            >
                <Box sx={style}>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3}}>
                        <Typography variant="h5" component="h2">
                            Create Notification
                        </Typography>
                        <IconButton onClick={closeAndResetForm} size="small">
                            <Close/>
                        </IconButton>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{mb: 2}} onClose={() => setError(null)}>
                            {error}
                        </Alert>
                    )}

                    <Grid2 container spacing={3}>
                        <Grid2 size={12}>
                            <TextField
                                fullWidth
                                label="Title"
                                value={formData.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                required
                                error={!formData.title && !!error}
                                placeholder="Enter notification title"
                            />
                        </Grid2>

                        <Grid2 size={12}>
                            <TextField
                                fullWidth
                                label="Message"
                                value={formData.message}
                                onChange={(e) => handleInputChange('message', e.target.value)}
                                required
                                multiline
                                rows={4}
                                error={!formData.message && !!error}
                                placeholder="Enter your notification message"
                            />
                        </Grid2>

                        <Grid2 size={12}>
                            <FormControl component="fieldset">
                                <Typography variant="subtitle1" gutterBottom>
                                    Recipient Type
                                </Typography>
                                <RadioGroup
                                    row
                                    value={formData.recipientType}
                                    onChange={(e) => handleInputChange('recipientType', e.target.value)}
                                >
                                    <FormControlLabel
                                        value="all"
                                        control={<Radio/>}
                                        label="Broadcast to All Users"
                                    />
                                    <FormControlLabel
                                        value="specific"
                                        control={<Radio/>}
                                        label="Select Specific Users"
                                    />
                                </RadioGroup>
                            </FormControl>
                        </Grid2>

                        {formData.recipientType === 'specific' && (
                            <Grid2 size={12}>
                                <Autocomplete
                                    multiple
                                    options={mockUsers}
                                    getOptionLabel={(option) => `${option.name} (${option.email})`}
                                    value={formData.selectedUsers}
                                    onChange={(_, newValue) => handleInputChange('selectedUsers', newValue)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Select Recipients"
                                            placeholder="Search for users..."
                                            error={formData.recipientType === 'specific' && formData.selectedUsers.length === 0 && !!error}
                                        />
                                    )}
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => (
                                            <Chip
                                                label={`${option.name} (${option.email})`}
                                                {...getTagProps({index})}
                                                color={option.isPetOwner ? 'primary' : 'default'}
                                            />
                                        ))
                                    }
                                    renderOption={(props, option) => (
                                        <li {...props}>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Typography>{option.name}</Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {option.email}
                                                </Typography>
                                                {option.isPetOwner && (
                                                    <Chip label="Pet Owner" size="small" color="primary"/>
                                                )}
                                            </Stack>
                                        </li>
                                    )}
                                />
                            </Grid2>
                        )}

                        <Grid2 size={{xs: 12, sm: 6}}>
                            <FormControl fullWidth>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    value={formData.category}
                                    label="Category"
                                    onChange={(e) => handleInputChange('category', e.target.value)}
                                >
                                    {categories.map((category) => (
                                        <MenuItem key={category} value={category}>
                                            {category.split('-').map(word =>
                                                word.charAt(0).toUpperCase() + word.slice(1)
                                            ).join(' ')}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid2>

                        <Grid2 size={{xs: 12, sm: 6}}>
                            <FormControl fullWidth>
                                <InputLabel>Priority</InputLabel>
                                <Select
                                    value={formData.priority}
                                    label="Priority"
                                    onChange={(e) => handleInputChange('priority', e.target.value)}
                                >
                                    <MenuItem value="high">High</MenuItem>
                                    <MenuItem value="normal">Normal</MenuItem>
                                    <MenuItem value="low">Low</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid2>
                    </Grid2>

                    <Box sx={{mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2}}>
                        <Button onClick={onClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            startIcon={<Send/>}
                            disabled={loading}
                            color={getPriorityColor(formData.priority)}
                        >
                            {loading ? 'Sending...' : formData.recipientType === 'all' ? 'Broadcast' : 'Send Notification'}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

const mockUsers = [
    {id: '1', name: 'Vivienne Balakrishnan', email: 'v.bala@example.com', isPetOwner: true},
    {id: '2', name: 'Law Ren Wong', email: 'callmepm@example.com', isPetOwner: true},
    {id: '3', name: 'Gracey Foo', email: 'graciously@vetclinic.com', isPetOwner: false},
    {id: '4', name: 'Xueyang', email: 'pangxueyang@gmail.com', isPetOwner: true},
    {id: '4', name: 'e0647424@u.nus.edu', email: 'e0647424@u.nus.edu', isPetOwner: true},
    // ... more users
]