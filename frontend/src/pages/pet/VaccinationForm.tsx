import React, {useContext, useState} from 'react';
import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Grid2,
    SelectChangeEvent,
    TextField
} from '@mui/material';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs'
import {Pet} from '../../api/types/pet.ts';
import dayjs, {Dayjs} from 'dayjs'; // Changed from: import * as dayjs from 'dayjs'
import 'dayjs/locale/en-sg.js';
import {ApiClientContext} from "../../providers/ApiClientProvider.tsx";
import {SNACKBAR_SEVERITY, SnackbarContext} from "../../providers/SnackbarProvider.tsx";
import {VaccinationRecord, VaccinationRecordRequest} from "../../api/types/vaccinationRecord.ts"; // import locale


interface VaccinationFormProps {
    open: boolean;
    onClose: () => void;
    pet: Pet;
}

// Vaccination Form Component
export const VaccinationForm: React.FC<VaccinationFormProps> = ({open, onClose, pet}) => {
    const {petApi} = useContext(ApiClientContext)
    const {showSnackbar} = useContext(SnackbarContext);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<Partial<VaccinationRecord>>({
        pet_id: pet.id,
        name: '',
        description: '',
        administered_at: new Date().toISOString(),
        administered_by: '1f00140f-acc8-6ed0-9cdc-5694cdc3ff77',
        lot_number: '',
        next_due_at: new Date(Date.now() + 31536000000).toISOString(), // Default to 1 year from now
        is_valid: true
    });

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

    // Handler for submitting vaccination record
    const handleSubmitVaccination = async () => {
        setIsSubmitting(true);
        try {
            // Type-safe check for required fields
            if (!formData.name || !formData.description || !formData.administered_at ||
                !formData.administered_by || !formData.next_due_at || !formData.lot_number) {

                // Build list of missing fields
                const missingFields = [];
                if (!formData.name) missingFields.push('Name');
                if (!formData.description) missingFields.push('Description');
                if (!formData.administered_at) missingFields.push('Administered Date');
                if (!formData.administered_by) missingFields.push('Administered By');
                if (!formData.next_due_at) missingFields.push('Next Due Date');
                if (!formData.lot_number) missingFields.push('Lot Number');

                showSnackbar(`Please fill in all required fields: ${missingFields.join(', ')}`, SNACKBAR_SEVERITY.ERROR);
                setIsSubmitting(false);
                return;
            }

            // Now we can safely create the request knowing all fields exist
            const vaccinationRecordRequest = {
                name: formData.name,
                description: formData.description,
                administered_at: formData.administered_at,
                administered_by: formData.administered_by,
                expires_at: formData.next_due_at,
                lot_number: formData.lot_number,
                next_due_at: formData.next_due_at,
                is_valid: true
            } as VaccinationRecordRequest; // Type assertion here if needed

            const response = await petApi.createVaccinationRecord(pet.id, vaccinationRecordRequest);
            console.log(response);
            if (response.success) {
                showSnackbar("Vaccination Record created successfully.", SNACKBAR_SEVERITY.SUCCESS);
            } else {
                showSnackbar(`Vaccination Record not created. ${response.message}`, SNACKBAR_SEVERITY.ERROR);
            }
            onClose();
        } catch (error) {
            console.error("Error adding vaccination record:", error);
            showSnackbar("An error occurred adding vaccination record.", SNACKBAR_SEVERITY.ERROR);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Add Vaccination Record for {pet.name}</DialogTitle>
            <DialogContent>
                <Box sx={{mt: 2}}>
                    <Grid2 container spacing={3}>
                        <Grid2 size={{xs: 12, sm: 6}}>
                            <TextField
                                fullWidth
                                label="Vaccination Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </Grid2>

                        <Grid2 size={{xs: 12, sm: 6}}>
                            <TextField
                                fullWidth
                                label="Administered By"
                                name="administered_by"
                                value={formData.administered_by}
                                onChange={handleChange}
                                required
                            />
                        </Grid2>

                        <Grid2 size={{xs: 12, sm: 6}}>
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
                                label="Lot Number"
                                name="lot_number"
                                value={formData.lot_number}
                                onChange={handleChange}
                                required
                            />
                        </Grid2>

                        <Grid2 size={{xs: 12, sm: 6}}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Administered Date"
                                    value={formData.administered_at ? dayjs(formData.administered_at) : null}
                                    onChange={handleDateChange('administeredDate')}
                                    slotProps={{textField: {fullWidth: true}}}
                                />
                            </LocalizationProvider>
                        </Grid2>

                        <Grid2 size={{xs: 12, sm: 6}}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Next Due Date"
                                    value={formData.next_due_at ? dayjs(formData.next_due_at) : null}
                                    onChange={handleDateChange('nextDueDate')}
                                    slotProps={{textField: {fullWidth: true}}}
                                />
                            </LocalizationProvider>
                        </Grid2>

                        <Grid2 size={{xs: 12}}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={formData.is_valid}
                                        onChange={handleCheckboxChange}
                                        name="isValid"
                                    />
                                }
                                label="Vaccination is valid"
                            />
                        </Grid2>

                    </Grid2>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={handleSubmitVaccination}
                    color="primary"
                    variant="contained"
                    disabled={!formData.name || !formData.description || !formData.administered_at ||
                        !formData.administered_by || !formData.next_due_at || !formData.lot_number}
                    startIcon={isSubmitting ? <CircularProgress size={20}/> : null}
                >
                    Save Record
                </Button>
            </DialogActions>
        </Dialog>
    );
};
