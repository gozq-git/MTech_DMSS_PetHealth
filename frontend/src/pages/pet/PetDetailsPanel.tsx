import React, {useContext, useState} from "react";
import {Button, Card, CardContent, Chip, Grid2, Paper, Stack, Tab, Tabs} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
    CakeOutlined,
    CalendarTodayOutlined,
    EventNoteOutlined,
    FemaleOutlined,
    MaleOutlined,
    MedicationOutlined,
    PetsOutlined,
    ScaleOutlined,
    StraightenOutlined,
    VaccinesOutlined
} from "@mui/icons-material";
import {TabPanel} from "./TabPanel.tsx";
import {Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator} from "@mui/lab";
import {Pet} from "../../api/types/pet.ts";
import {VaccinationRecord} from "../../api/types/vaccinationRecord.ts";
import Divider from "@mui/material/Divider";
import {toProperCase} from "../../util/toProperCase.ts";
import {MedicationRecord} from "../../api/types/medicationRecord.ts";
import {VaccinationForm} from "./VaccinationForm.tsx";
import {MedicationForm} from "./MedicationForm.tsx";
import {ApiClientContext} from "../../providers/ApiClientProvider.tsx";
import {SnackbarContext} from "../../providers/SnackbarProvider.tsx";
import AddIcon from "@mui/icons-material/Add";

interface PetDetailsPopupContentProps {
    pet: Pet;
    vaccinationRecords: VaccinationRecord[];
    medicationRecords: MedicationRecord[];
    onRecordAdded?: () => void;
}

type PetPropertyConfig<K extends keyof Pet> = {
    key: K;
    label: string;
    icon?: React.ReactNode; // This is the new property I added
    format?: (value: Pet[K]) => string;
};

export const PetDetailsPanel: React.FC<PetDetailsPopupContentProps> = ({
                                                                           pet,
                                                                           vaccinationRecords,
                                                                           medicationRecords,
                                                                           onRecordAdded
                                                                       }) => {
    const {petApi} = useContext(ApiClientContext);
    const {showSnackbar} = useContext(SnackbarContext);
    const [tabValue, setTabValue] = useState(0);
    const [isAddVacFormOpen, setIsAddVacFormOpen] = useState(false);
    const [isAddMedFormOpen, setIsAddMedFormOpen] = useState(false);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        console.log(event);
        setTabValue(newValue);
    };
    const handleOpenAddVacForm = () => {
        handleCloseAddMedForm()
        setIsAddVacFormOpen(true);
    }
    const handleOpenAddMedForm = () => {
        handleCloseAddVacForm()
        setIsAddMedFormOpen(true)
    }
    const handleCloseAddVacForm = () => {
        setIsAddVacFormOpen(false);
    }
    const handleCloseAddMedForm = () => {
        setIsAddMedFormOpen(false);
    }

    const petProperties: PetPropertyConfig<keyof Pet>[] = [
        {
            key: 'gender',
            label: 'Gender',
            icon: pet.gender === 'Male' ? <MaleOutlined color="primary"/> : <FemaleOutlined color="secondary"/>
        },
        {key: 'species', label: 'Type', icon: <PetsOutlined/>, format: (value) => toProperCase(value.toString())},
        {key: 'breed', label: 'Breed', icon: <PetsOutlined/>},
        {key: 'date_of_birth', label: 'Date of Birth', icon: <CakeOutlined/>, format: (value) => formatDate(value)},
        {key: 'weight', label: 'Weight', icon: <ScaleOutlined/>, format: (value) => `${value} kg`},
        {key: 'height_cm', label: 'Height', icon: <StraightenOutlined/>, format: (value) => `${value} cm`},
        {key: 'neck_girth_cm', label: 'Neck Girth', icon: <StraightenOutlined/>, format: (value) => `${value} cm`},
        {key: 'chest_girth_cm', label: 'Chest Girth', icon: <StraightenOutlined/>, format: (value) => `${value} cm`},
        {key: 'last_measured', label: 'Last Measured', icon: <CalendarTodayOutlined/>},
        {key: 'is_neutered', label: 'Neutered', format: (value) => value ? 'Yes' : 'No'},
        {key: 'microchip_number', label: 'Microchip Number'}
    ];
    const formatDate = (value: string | number | boolean): string => {
        if (typeof value === 'string' && value) {
            try {
                return new Date(value).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            } catch (e) {
                return String(value);
            }
        }
        return String(value);
    };

    const contentHeight = "calc(100vh - 250px)";

    const petVaccinationRecords = vaccinationRecords.filter(record => record.pet_id === pet.id);
    const petMedicationRecords = medicationRecords.filter(record => record.pet_id === pet.id);



    return (
        <Paper elevation={0} sx={{borderRadius: 4, display: 'flex', flexDirection: 'column', maxHeight: '60vh'}}>
            {/* Tabs - START */}
            <Box sx={{
                borderBottom: 1,
                borderColor: "divider",
                position: "sticky",
                top: 0,
                backgroundColor: "white",
                zIndex: 1
            }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    textColor="primary"
                    indicatorColor="primary"
                >
                    <Tab icon={<PetsOutlined/>} label="Details"/>
                    <Tab icon={<EventNoteOutlined/>} label="Timeline"/>
                    <Tab icon={<VaccinesOutlined/>} label="Vaccinations"/>
                    <Tab icon={<MedicationOutlined/>} label="Medications"/>
                </Tabs>
            </Box>
            {/* Tabs - END */}
            <Box sx={{flexGrow: 1, position: 'relative'}}>
                {/* Pet Details Tab - START */}
                <TabPanel value={tabValue} index={0}>
                    <Grid2 container spacing={3} overflow='auto'>
                        <Grid2 size={{md: 12}}>
                            <Grid2 container spacing={2}>
                                {petProperties.filter(prop =>
                                    pet[prop.key] !== null &&
                                    pet[prop.key] !== undefined
                                ).map(property => {
                                    const value = pet[property.key];
                                    const displayValue = property.format ? property.format(value) : String(value);
                                    return (
                                        <Grid2 size={6} key={property.key}>
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                p: 2,
                                                borderRadius: 2,
                                                bgcolor: '#f5f5f5'
                                            }}>
                                                <Box sx={{mr: 2, color: 'primary.main'}}>
                                                    {property.icon}
                                                </Box>
                                                <Box>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {property.label}
                                                    </Typography>
                                                    <Typography variant="body1" fontWeight="medium">
                                                        {displayValue}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Grid2>
                                    );
                                })}
                            </Grid2>
                        </Grid2>
                    </Grid2>
                </TabPanel>
                {/* Pet Details Tab - END */}
                {/* Timeline Tab - START */}
                <TabPanel value={tabValue} index={1}>
                    <Box sx={{height: contentHeight, overflow: "auto"}}>
                        <Timeline>
                            {vaccinationRecords.map((record, index) => (
                                <TimelineItem key={record.id}>
                                    <TimelineSeparator>
                                        <TimelineDot/>
                                        {index < vaccinationRecords.length - 1 && <TimelineConnector/>}
                                    </TimelineSeparator>
                                    <TimelineContent>
                                        <Card sx={{mb: 2}}>
                                            <CardContent>
                                                <Typography variant="subtitle1" fontWeight="bold">
                                                    {record.name}
                                                </Typography>
                                                <Typography variant="body2">
                                                    {record.description}
                                                </Typography>
                                                <Box sx={{mt: 1}}>
                                                    <Chip
                                                        size="small"
                                                        color={record.is_valid ? "success" : "error"}
                                                        label={record.is_valid ? "Valid" : "Expired"}
                                                    />
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </TimelineContent>
                                </TimelineItem>
                            ))}
                        </Timeline>
                    </Box>
                </TabPanel>
                {/* Timeline Tab - END */}
                {/* Vaccinations Tab - START */}
                <TabPanel value={tabValue} index={2}>
                    <Box sx={{height: contentHeight, overflow: "auto"}}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon/>}
                            onClick={handleOpenAddVacForm}
                            sx={{marginBottom: "16px", borderRadius: "20px", textTransform: "none", fontSize: "16px"}}
                        >
                            Vaccination Record
                        </Button>
                        {petVaccinationRecords.length > 0 ? (
                            <Grid2 container spacing={2}>
                                {petVaccinationRecords.map((record) => (
                                    <Grid2 size={{xs: 12, sm: 6}} key={record.id}>
                                        <Card sx={{height: '100%'}}>
                                            <CardContent>
                                                <Box sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    mb: 1
                                                }}>
                                                    <Typography variant="h6">
                                                        {record.name}
                                                    </Typography>
                                                    <Chip
                                                        size="small"
                                                        color={record.is_valid ? "success" : "error"}
                                                        label={record.is_valid ? "Valid" : "Expired"}
                                                    />
                                                </Box>
                                                <Typography variant="body2" sx={{mb: 2}}>
                                                    {record.description}
                                                </Typography>
                                                <Divider sx={{mb: 2}}/>
                                                <Grid2 container spacing={1}>
                                                    <Grid2 size={{xs: 12, sm: 6}}>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Administered
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            {new Date(record.administered_at).toLocaleString()}
                                                        </Typography>
                                                    </Grid2>
                                                    <Grid2 size={{xs: 12, sm: 6}}>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Next Due
                                                        </Typography>
                                                        <Typography
                                                            variant="body1">{new Date(record.next_due_at).toLocaleString()}
                                                        </Typography>
                                                    </Grid2>
                                                    <Grid2 size={{xs: 12}}>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Administered By
                                                        </Typography>
                                                        <Typography
                                                            variant="body1">{record.administered_by}</Typography>
                                                    </Grid2>
                                                </Grid2>
                                            </CardContent>
                                        </Card>
                                    </Grid2>
                                ))}
                            </Grid2>) : (
                            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 4}}>
                                <VaccinesOutlined sx={{fontSize: 60, color: 'text.disabled', mb: 2}}/>
                                <Typography variant="body1" color="text.secondary">
                                    No vaccination records available
                                </Typography>
                            </Box>
                        )}
                    </Box>

                </TabPanel>
                {/* Vaccinations Tab - END */}
                {/* Medications Tab - START */}
                <TabPanel value={tabValue} index={3}>
                    <Box sx={{height: contentHeight, overflow: "auto"}}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon/>}
                            onClick={handleOpenAddMedForm}
                            sx={{borderRadius: "20px", textTransform: "none", fontSize: "16px"}}
                        >
                            Medication Record
                        </Button>
                        {petMedicationRecords.length > 0 ? (
                            <Grid2 container spacing={2}>
                                {petMedicationRecords.map((medication) => (
                                    <Grid2 size={{xs: 12, sm: 6}} key={medication.id}>
                                        <Card sx={{height: '100%', position: 'relative'}}>
                                            <CardContent>
                                                <Box sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    mb: 1
                                                }}>
                                                    <Typography variant="h6">
                                                        {medication.name}
                                                    </Typography>
                                                    <Stack direction="row" spacing={2}>
                                                        {medication.requiresPrescription && (
                                                            <Chip
                                                                size="small"
                                                                color="primary"
                                                                label="Prescription"
                                                                sx={{fontSize: '0.7rem'}}
                                                            />
                                                        )}
                                                        <Chip
                                                            size="small"
                                                            color={new Date(medication.end_date) > new Date() ? "success" : "error"}
                                                            label={new Date(medication.end_date) > new Date() ? "Active" : "Completed"}
                                                        />
                                                    </Stack>
                                                </Box>
                                                <Typography variant="body2" sx={{mb: 2}}>
                                                    {medication.description}
                                                </Typography>
                                                <Divider sx={{mb: 2}}/>
                                                <Grid2 container spacing={1}>
                                                    <Grid2 size={{xs: 12, sm: 6}}>
                                                        <Typography variant="body2"
                                                                    color="text.secondary">Dosage</Typography>
                                                        <Typography variant="body1"
                                                                    fontWeight="medium">{medication.dosage}</Typography>
                                                    </Grid2>
                                                    <Grid2 size={{xs: 12, sm: 6}}>
                                                        <Typography variant="body2"
                                                                    color="text.secondary">Frequency</Typography>
                                                        <Typography variant="body1"
                                                                    fontWeight="medium">{medication.frequency}</Typography>
                                                    </Grid2>
                                                    <Grid2 size={{xs: 12, sm: 6}}>
                                                        <Typography variant="body2" color="text.secondary">Start
                                                            Date</Typography>
                                                        <Typography variant="body1">
                                                            {new Date(medication.start_date).toLocaleDateString()}
                                                        </Typography>
                                                    </Grid2>
                                                    <Grid2 size={{xs: 12, sm: 6}}>
                                                        <Typography variant="body2" color="text.secondary">End
                                                            Date</Typography>
                                                        <Typography variant="body1">
                                                            {new Date(medication.end_date).toLocaleDateString()}
                                                        </Typography>
                                                    </Grid2>
                                                    <Grid2 size={{xs: 12}}>
                                                        <Typography variant="body2" color="text.secondary">Prescribed
                                                            By</Typography>
                                                        <Typography
                                                            variant="body1">{medication.prescribed_by}</Typography>
                                                    </Grid2>
                                                </Grid2>
                                            </CardContent>
                                        </Card>
                                    </Grid2>
                                ))}
                            </Grid2>
                        ) : (
                            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 4}}>
                                <MedicationOutlined sx={{fontSize: 60, color: 'text.disabled', mb: 2}}/>
                                <Typography variant="body1" color="text.secondary">
                                    No medication records available
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </TabPanel>
                {/* Medications Tab - END */}
            </Box>
            {/* Add vaccination/medication record form - START */}
            <VaccinationForm
                open={isAddVacFormOpen}
                onClose={handleCloseAddVacForm}
                pet={pet}
            />

            <MedicationForm
                open={isAddMedFormOpen}
                onClose={handleCloseAddMedForm}
                pet={pet}
            />
            {/* Add vaccination/medication record form - END */}
        </Paper>
    )
}

