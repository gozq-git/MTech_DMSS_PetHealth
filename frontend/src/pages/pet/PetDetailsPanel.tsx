import React, {useState} from "react";
import {Card, CardContent, Chip, Grid2, Paper, Tab, Tabs} from "@mui/material";
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
import VaccinationRecord from "../../api/types/vaccinationRecord.ts";
import Divider from "@mui/material/Divider";
import {toProperCase} from "../../util/toProperCase.ts";

interface PetDetailsPopupContentProps {
    pet: Pet;
    vaccinationRecords: VaccinationRecord[];
}

type PetPropertyConfig<K extends keyof Pet> = {
    key: K;
    label: string;
    icon?: React.ReactNode; // This is the new property I added
    format?: (value: Pet[K]) => string;
};

export const PetDetailsPanel: React.FC<PetDetailsPopupContentProps> = ({pet, vaccinationRecords}) => {
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        console.log(event);
        setTabValue(newValue);
    };


    const petProperties: PetPropertyConfig<keyof Pet>[] = [
        {
            key: 'gender',
            label: 'Gender',
            icon: pet.gender === 'Male' ? <MaleOutlined color="primary"/> : <FemaleOutlined color="secondary"/>
        },
        {key: 'species', label: 'Type', icon: <PetsOutlined/>, format: (value) => toProperCase(value.toString())},
        {key: 'breed', label: 'Breed', icon: <PetsOutlined/>},
        {key: 'dateOfBirth', label: 'Date of Birth', icon: <CakeOutlined/>},
        {key: 'weight', label: 'Weight', icon: <ScaleOutlined/>, format: (value) => `${value} kg`},
        {key: 'height', label: 'Height', icon: <StraightenOutlined/>, format: (value) => `${value} cm`},
        {key: 'neckGirthCm', label: 'Neck Girth', icon: <StraightenOutlined/>, format: (value) => `${value} cm`},
        {key: 'chestGirthCm', label: 'Chest Girth', icon: <StraightenOutlined/>, format: (value) => `${value} cm`},
        {key: 'lastMeasured', label: 'Last Measured', icon: <CalendarTodayOutlined/>},
        {key: 'isNeutered', label: 'Neutered', format: (value) => value ? 'Yes' : 'No'},
        {key: 'microchipNumber', label: 'Microchip Number'}
    ];
    const contentHeight = "calc(100vh - 250px)";
    return (
        <Paper elevation={0} sx={{borderRadius: 4, mt: 2, display: 'flex', flexDirection: 'column', height: '100%'}}>
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
            {/* Pet Details Tab - START */}
            <Box sx={{flexGrow: 1, position: 'relative'}}>
                <TabPanel value={tabValue} index={0}>
                    <Box sx={{height: contentHeight, overflow: "auto", p: 3}}>
                        <Grid2 container spacing={3}>
                            {/* Pet Details */}
                            <Grid2 size={{md: 8}}>
                                <Card elevation={2} sx={{borderRadius: 4}}>
                                    <CardContent>
                                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                                            Physical Information
                                        </Typography>

                                        <Grid2 container spacing={2}>
                                            {petProperties.filter(prop =>
                                                ['gender', 'weight', 'height', 'dateOfBirth'].includes(prop.key as string) &&
                                                pet[prop.key] !== null &&
                                                pet[prop.key] !== undefined
                                            ).map(property => {
                                                const value = pet[property.key];
                                                const displayValue = property.format ? property.format(value) : String(value);

                                                return (
                                                    <Grid2 size={{xs: 12, sm: 6}} key={property.key}>
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
                                    </CardContent>
                                </Card>
                            </Grid2>
                            {/*<Divider sx={{my: 3}}/>*/}
                            <Grid2 size={{md: 8}}>
                                <Card elevation={2} sx={{borderRadius: 4}}>
                                    <CardContent>
                                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                                            Measurements
                                        </Typography>

                                        <Grid2 container spacing={2}>
                                            {petProperties.filter(prop =>
                                                ['neckGirthCm', 'chestGirthCm', 'lastMeasured'].includes(prop.key as string) &&
                                                pet[prop.key] !== null &&
                                                pet[prop.key] !== undefined
                                            ).map(property => {
                                                const value = pet[property.key];
                                                const displayValue = property.format ? property.format(value) : String(value);

                                                return (
                                                    <Grid2 size={{xs: 12, sm: 6}} key={property.key}>
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

                                        {/*<Divider sx={{my: 3}}/>*/}
                                    </CardContent>
                                </Card>
                            </Grid2>
                            <Grid2 size={{md: 8}}>
                                <Card elevation={2} sx={{borderRadius: 4}}>
                                    <CardContent>
                                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                                            Additional Information
                                        </Typography>

                                        <Grid2 container spacing={2}>
                                            {petProperties.filter(prop =>
                                                ['isNeutered', 'breed', 'species'].includes(prop.key as string) &&
                                                !['gender', 'dateOfBirth', 'weight', 'height', 'neckGirthCm', 'chestGirthCm', 'lastMeasured'].includes(prop.key as string) &&
                                                pet[prop.key] !== null &&
                                                pet[prop.key] !== undefined
                                            ).map(property => {
                                                const value = pet[property.key];
                                                const displayValue = property.format ? property.format(value) : String(value);

                                                return (
                                                    <Grid2 size={{xs: 12, sm: 6}} key={property.key}>
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
                                    </CardContent>
                                </Card>
                            </Grid2>
                        </Grid2>
                    </Box>
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
                                                <Typography variant="body2" color="text.secondary">
                                                    Administered: {new Date(record.administeredDate).toLocaleDateString()}
                                                </Typography>
                                                <Typography variant="body2">
                                                    {record.description}
                                                </Typography>
                                                <Box sx={{mt: 1}}>
                                                    <Chip
                                                        size="small"
                                                        color={record.isValid ? "success" : "error"}
                                                        label={record.isValid ? "Valid" : "Expired"}
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
                        <Grid2 container spacing={2}>
                            {vaccinationRecords.map((record) => (
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
                                                    color={record.isValid ? "success" : "error"}
                                                    label={record.isValid ? "Valid" : "Expired"}
                                                />
                                            </Box>
                                            <Typography variant="body2" sx={{mb: 2}}>
                                                {record.description}
                                            </Typography>
                                            <Divider sx={{mb: 2}}/>
                                            <Grid2 container spacing={1}>
                                                <Grid2 size={{xs: 12, sm: 6}}>
                                                    <Typography variant="body2"
                                                                color="text.secondary">Administered</Typography>
                                                    <Typography
                                                        variant="body1">{new Date(record.administeredDate).toLocaleDateString()}</Typography>
                                                </Grid2>
                                                <Grid2 size={{xs: 12, sm: 6}}>
                                                    <Typography variant="body2" color="text.secondary">Next
                                                        Due</Typography>
                                                    <Typography
                                                        variant="body1">{new Date(record.nextDueDate).toLocaleDateString()}</Typography>
                                                </Grid2>
                                                <Grid2 size={{xs: 12}}>
                                                    <Typography variant="body2" color="text.secondary">Administered
                                                        By</Typography>
                                                    <Typography variant="body1">{record.administeredBy}</Typography>
                                                </Grid2>
                                            </Grid2>
                                        </CardContent>
                                    </Card>
                                </Grid2>
                            ))}
                        </Grid2>
                    </Box>
                </TabPanel>
                {/* Vaccinations Tab - END */}

                {/* Medications Tab - START */}
                <TabPanel value={tabValue} index={3}>
                    <Box sx={{height: contentHeight, overflow: "auto"}}>
                        <Typography variant="body1" color="text.secondary">
                            No medication records available
                        </Typography>
                    </Box>
                </TabPanel>
                {/* Medications Tab - END */}
            </Box>
        </Paper>
    )
}

