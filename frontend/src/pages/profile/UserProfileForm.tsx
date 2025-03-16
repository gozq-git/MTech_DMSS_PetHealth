import { Button, Container, Paper, Stack, TextField, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import React, { useContext, useState } from "react";
import { SNACKBAR_SEVERITY, SnackbarContext } from "../../providers/SnackbarProvider.tsx";
import Divider from "@mui/material/Divider";
import { ApiClientContext } from "../../providers/ApiClientProvider.tsx"; // Import the ApiClientContext
import { User, UserCreateInput } from "../../api/types/user.ts"; // Import the User and UserCreateInput types

interface UserProfileFormItem {
    id: string;
    label: string;
    type?: string; // Add type for input fields (e.g., text, email, etc.)
}

interface UserProfileFormValues {
    account_name: string;
    display_name: string;
    email: string;
    bio: string;
    profile_picture: string;
}

const userProfileFormItems: UserProfileFormItem[] = [
    {
        id: "account_name",
        label: "Account Name",
        type: "text",
    },
    {
        id: "display_name",
        label: "Display Name",
        type: "text",
    },
    {
        id: "email",
        label: "Email",
        type: "email",
    },
    {
        id: "bio",
        label: "Bio",
        type: "text",
    },
    {
        id: "profile_picture",
        label: "Profile Picture URL",
        type: "text",
    },
];

export const UserProfileForm = () => {
    const { showSnackbar } = useContext(SnackbarContext);
    const { userApi } = useContext(ApiClientContext); // Access the userApi from context
    const [formValues, setFormValues] = useState<UserProfileFormValues>({
        account_name: '',
        display_name: '',
        email: '',
        bio: '',
        profile_picture: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({ ...formValues, [e.target.name]: e.target.value });
    };

    const submitForm = async () => {
        try {
            // Attempt to retrieve the user by a unique identifier (e.g., email)
            const existingUser = await userApi.retrieveUser();
    
            if (existingUser) {
                // If the user exists, show a message and return
                showSnackbar("User already exists!", SNACKBAR_SEVERITY.INFO);
                return;
            }
    
            // If the user doesn't exist, proceed to register the user
            const userData: Omit<User, 'ID'> = {
                account_name: formValues.account_name,
                display_name: formValues.display_name,
                email: formValues.email,
                bio: formValues.bio,
                profile_picture: formValues.profile_picture,
                last_active: new Date().toISOString(), // Set current timestamp
                ACCOUNT_TYPE: 'user', // Default account type
                account_created: new Date().toISOString(), // Set current timestamp
                isDeleted: false, // Default value
            };
    
            // Call the registerUser API
            const registeredUser = await userApi.registerUser(userData);
    
            // Show success message
            showSnackbar("User registered successfully!", SNACKBAR_SEVERITY.SUCCESS);
    
            // Optionally, you can redirect the user or update the state
            console.log("Registered user:", registeredUser);
        } catch (error) {
            console.error("Failed to register user:", error);
            showSnackbar("Failed to register user. Please try again.", SNACKBAR_SEVERITY.ERROR);
        }
    };

    return (
        <Container maxWidth="lg">
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    User Profile
                </Typography>
                <Typography variant="body1" gutterBottom color="text.secondary" sx={{ mb: 4 }}>
                    Please fill in your personal information below
                </Typography>

                <Divider sx={{ mb: 4 }} />

                <Stack spacing={3} justifyContent="space-between">
                    {userProfileFormItems.map((item) => (
                        <TextField
                            key={String(item.id)}
                            id={item.id}
                            name={item.id}
                            label={item.label}
                            variant="outlined"
                            fullWidth
                            type={item.type || "text"} // Use the specified type or default to "text"
                            value={formValues[item.id as keyof UserProfileFormValues]}
                            onChange={handleChange}
                        />
                    ))}

                    <Box sx={{ mt: 4 }}>
                        <Divider sx={{ mb: 4 }} />
                        <Stack direction="row" spacing={2} justifyContent="center">
                            <Button
                                variant="contained"
                                onClick={submitForm}
                                sx={{ px: 4 }}
                            >
                                Submit
                            </Button>
                        </Stack>
                    </Box>
                </Stack>
            </Paper>
        </Container>
    );
};
