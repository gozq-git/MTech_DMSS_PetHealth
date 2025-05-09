import React, {useContext, useState} from 'react';
import {
    Box,
    Button,
    Checkbox, CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    Grid2,
    InputLabel,
    MenuItem,
    Select, SelectChangeEvent,
    TextField
} from '@mui/material';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import {Pet} from '../../api/types/pet.ts';
import {MedicationRecord} from '../../api/types/medicationRecord.ts';
import {Dayjs} from "dayjs";
import dayjs from 'dayjs';
import {SNACKBAR_SEVERITY, SnackbarContext} from "../../providers/SnackbarProvider.tsx";
import {ApiClientContext} from "../../providers/ApiClientProvider.tsx";

interface MedicationFormProps {
    open: boolean;
    onClose: () => void;
    pet: Pet;
}

// Medication Form Component
export const MedicationForm: React.FC<MedicationFormProps> = ({open, onClose, pet}) => {
    const {showSnackbar} = useContext(SnackbarContext);
    const {petApi} = useContext(ApiClientContext)
    const [formData, setFormData] = useState<Partial<MedicationRecord>>({
        pet_id: pet.id,
        name: '',
        description: '',
        dosage: '',
        frequency: '',
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 2592000000).toISOString(), // Default to 30 days from now
        requiresPrescription: false,
        prescribed_by: '1f00140f-acc8-6ed0-9cdc-5694cdc3ff77'
    });
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
        const {name, value} = e.target;
        setFormData({...formData, [name as string]: value});
    };

    const handleDateChange = (name: string) => (date: Dayjs | null) => {
        if (date) {
            setFormData({...formData, [name]: date.toISOString()});
        }
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.name]: e.target.checked});
    };

    // Handler for submitting medication record
    const handleSubmitMedication = async () => {
        setIsSubmitting(true);
        try {
            await petApi.createMedicationRecord(formData);
            showSnackbar("Medication Record created successfully.", SNACKBAR_SEVERITY.SUCCESS);
            // showSnackbar("NOT IMPLEMENTED YET!!", SNACKBAR_SEVERITY.WARNING);
        } catch (error) {
            console.error("Error adding medication record:", error);
            showSnackbar("An error occurred adding medication record.", SNACKBAR_SEVERITY.ERROR);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Common frequencies for medications
    const frequencyOptions = [
        'Once daily',
        'Twice daily',
        'Three times daily',
        'Every other day',
        'Weekly',
        'As needed',
        'Monthly'
    ];

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Add Medication Record for {pet.name}</DialogTitle>
            <DialogContent>
                <Box sx={{mt: 2}}>
                    <Grid2 container spacing={3}>
                        <Grid2 size={{xs: 12, sm: 6}}>
                            <TextField
                                fullWidth
                                label="Medication Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </Grid2>

                        <Grid2 size={{xs: 12, sm: 6}}>
                            <TextField
                                fullWidth
                                label="Prescribed By"
                                name="prescribedBy"
                                value={formData.prescribed_by}
                                onChange={handleChange}
                                required
                            />
                        </Grid2>

                        <Grid2 size={{xs: 12}}>
                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                multiline
                                rows={2}
                            />
                        </Grid2>

                        <Grid2 size={{xs: 12, sm: 6}}>
                            <TextField
                                fullWidth
                                label="Dosage"
                                name="dosage"
                                value={formData.dosage}
                                onChange={handleChange}
                                required
                                placeholder="e.g., 10mg, 1 tablet"
                            />
                        </Grid2>

                        <Grid2 size={{xs: 12, sm: 6}}>
                            <FormControl fullWidth required>
                                <InputLabel id="frequency-label">Frequency</InputLabel>
                                <Select
                                    labelId="frequency-label"
                                    name="frequency"
                                    value={formData.frequency}
                                    onChange={handleChange}
                                    label="Frequency"
                                >
                                    {frequencyOptions.map(option => (
                                        <MenuItem key={option} value={option}>{option}</MenuItem>
                                    ))}
                                    <MenuItem value="custom">
                                        <em>Custom</em>
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Grid2>

                        {formData.frequency === 'custom' && (
                            <Grid2 size={{xs: 12}}>
                                <TextField
                                    fullWidth
                                    label="Custom Frequency"
                                    name="frequency"
                                    value={formData.frequency === 'custom' ? '' : formData.frequency}
                                    onChange={handleChange}
                                    placeholder="Specify custom frequency"
                                />
                            </Grid2>
                        )}

                        <Grid2 size={{xs: 12, sm: 6}}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Start Date"
                                    value={formData.start_date ? dayjs(formData.start_date) : null}
                                    onChange={handleDateChange('startDate')}
                                    slotProps={{textField: {fullWidth: true}}}
                                />
                            </LocalizationProvider>
                        </Grid2>

                        <Grid2 size={{xs: 12, sm: 6}}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="End Date"
                                    value={formData.end_date ? dayjs(formData.end_date) : null}
                                    onChange={handleDateChange('endDate')}
                                    slotProps={{textField: {fullWidth: true}}}
                                />
                            </LocalizationProvider>
                        </Grid2>

                        <Grid2 size={{xs: 12}}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={formData.requiresPrescription}
                                        onChange={handleCheckboxChange}
                                        name="requiresPrescription"
                                    />
                                }
                                label="Requires Prescription"
                            />
                        </Grid2>
                    </Grid2>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={handleSubmitMedication}
                    color="primary"
                    variant="contained"
                    disabled={!formData.name || !formData.dosage || !formData.frequency || !formData.prescribed_by}
                    startIcon={isSubmitting ? <CircularProgress size={20}/> : null}
                >
                    Save Record
                </Button>
            </DialogActions>
        </Dialog>
    );
};