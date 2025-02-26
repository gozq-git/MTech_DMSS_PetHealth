import {Button, Container, Paper, Stack, TextField, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import React, {useContext, useState} from "react";
import {SNACKBAR_SEVERITY, SnackbarContext} from "../../providers/SnackbarProvider.tsx";
import Divider from "@mui/material/Divider";

interface VetProfileFormItem {
    id: string,
    label: string,
}

interface VetProfileFormValues {
    title: string;
    firstName: string;
    lastName: string;
    occupation: string;
    licenseNumber: string;
    licenseExpiry: string;
    qualification: string;
    accreditation: string;
    vetCenter: string;
}

const userProfileFormItems: VetProfileFormItem[] = [
    {
        id: "title",
        label: "Title",
    },
    {
        id: "firstName",
        label: "First Name",
    },
    {
        id: "lastName",
        label: "Last Name",
    },
    {
        id: "occupation",
        label: "Occupation",
    },
    {
        id: "licenseNumber",
        label: "License Number",
    },
    {
        id: "licenseExpiry",
        label: "License Expiry",
    },
    {
        id: "qualification",
        label: "Qualification",
    },
    {
        id: "accreditation",
        label: "Accreditation",
    },
    {
        id: "Veterinary Center",
        label: "Veterinary Center",
    }
]

export const VetProfileForm = () => {
    const {showSnackbar} = useContext(SnackbarContext);
    const [formValues, setFormValues] = useState<VetProfileFormValues>({
        title: "",
        firstName: "",
        lastName: "",
        licenseExpiry: "",
        licenseNumber: "",
        occupation: "",
        qualification: "",
        accreditation: "",
        vetCenter: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({...formValues, [e.target.name]: e.target.value});
    }
    const submitForm = () => {
        const request = JSON.stringify(formValues);

        showSnackbar(`TODO: PUT Request:${request} `, SNACKBAR_SEVERITY.WARNING)
    }
    return (
        <Container maxWidth="lg">
            <Paper elevation={3} sx={{p: 4, mt: 4}}>
                {/*<Box>*/}
                <Typography variant="h4" gutterBottom>
                    Vet Profile
                </Typography>
                <Typography variant="body1" gutterBottom color="text.secondary" sx={{mb: 4}}>
                    Please fill in your personal information below
                </Typography>

                <Divider sx={{mb: 4}}/>

                <Stack spacing={3} justifyContent="space-between">
                    {userProfileFormItems.map((item) => (
                        <TextField
                            key={String(item.id)}
                            id={item.id}
                            name={item.id}
                            label={item.label}
                            variant="outlined"
                            fullWidth
                            value={formValues[item.id as keyof VetProfileFormValues]}
                            onChange={handleChange}
                        />
                    ))}

                    <Box sx={{mt: 4}}>
                        <Divider sx={{mb: 4}}/>
                        <Stack direction="row" spacing={2} justifyContent="center">
                            <Button
                                variant="contained"
                                onClick={submitForm}
                                sx={{px: 4}}
                            >
                                Submit
                            </Button>
                        </Stack>
                    </Box>
                </Stack>
                {/*</Box>*/}
            </Paper>
        </Container>
    )
}

