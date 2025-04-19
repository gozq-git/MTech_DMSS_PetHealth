import React, { useState } from 'react';
import {
    Box,
    Button,
    Modal,
    Typography,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Chip,
    Autocomplete,
    Grid,
    Alert,
    IconButton,
    Stack,
} from '@mui/material';
import { Close, Send } from '@mui/icons-material';

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
                                                                                    onClose,
                                                                                    onSubmit,
                                                                                    availableUsers = [],
                                                                                }) => {
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

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            if (onSubmit) {
                await onSubmit(formData);
            }
            onClose();
            // Reset form
            setFormData({
                title: '',
                message: '',
                recipientType: 'all',
                selectedUsers: [],
                priority: 'normal',
                category: 'general',
            });
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

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="create-notification-modal"
            aria-describedby="create-and-send-notification-to-users"
        >
            <Box sx={style}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" component="h2">
                        Create Notification
                    </Typography>
                    <IconButton onClick={onClose} size="small">
                        <Close />
                    </IconButton>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Title"
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            required
                            error={!formData.title && !!error}
                            placeholder="Enter notification title"
                        />
                    </Grid>

                    <Grid item xs={12}>
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
                    </Grid>

                    <Grid item xs={12}>
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
                                    control={<Radio />}
                                    label="Broadcast to All Users"
                                />
                                <FormControlLabel
                                    value="specific"
                                    control={<Radio />}
                                    label="Select Specific Users"
                                />
                            </RadioGroup>
                        </FormControl>
                    </Grid>

                    {formData.recipientType === 'specific' && (
                        <Grid item xs={12}>
                            <Autocomplete
                                multiple
                                options={availableUsers}
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
                                            {...getTagProps({ index })}
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
                                                <Chip label="Pet Owner" size="small" color="primary" />
                                            )}
                                        </Stack>
                                    </li>
                                )}
                            />
                        </Grid>
                    )}

                    <Grid item xs={12} sm={6}>
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
                    </Grid>

                    <Grid item xs={12} sm={6}>
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
                    </Grid>
                </Grid>

                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        startIcon={<Send />}
                        disabled={loading}
                        color={getPriorityColor(formData.priority)}
                    >
                        {loading ? 'Sending...' : formData.recipientType === 'all' ? 'Broadcast' : 'Send Notification'}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};
