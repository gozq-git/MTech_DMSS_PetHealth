import React, {useContext, useEffect, useState} from 'react';
import {
    Box,
    Container,
    Typography,

} from '@mui/material';
import {ConsultationRoomManager} from "./ConsultationRoomManager.tsx";
import {ApiClientContext} from "../../../providers/ApiClientProvider.tsx";
import {SNACKBAR_SEVERITY, SnackbarContext} from "../../../providers/SnackbarProvider.tsx";
import {User} from "../../../api/types/user.ts";

// interface TeleconsultPageProps {
//     id: string;
//     role: 'vet' | 'pet-owner';
// }

export const NewTeleconsultPage: React.FC = () => {
    const {userApi} = useContext(ApiClientContext);
    const {showSnackbar} = useContext(SnackbarContext);
    // const [user, setUser] = useState<User | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<null | 'vet' | 'pet-owner'>(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const result = await userApi.retrieveUser();
                if (result != null) {
                    if (result.success && result.data) {
                        const role = result.data.VET ? "vet" : "pet-owner";
                        setUserRole(role);
                        setUserId(result.data.id);
                        // setUser(result.data);
                    } else {
                        // setUser(null);
                    }
                } else {
                    // setUser(null);
                }
            } catch (err) {
                showSnackbar('Failed to load profile data', SNACKBAR_SEVERITY.ERROR);
            }
        };
        fetchUserProfile();
    }, []);

    return (
        <Container maxWidth="xl" sx={{mt: 4, mb: 4}}>
            <Box>
                <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 3}}>
                    <Typography variant="h4" component="h1">
                        Vet Teleconsultation Service
                    </Typography>
                </Box>
                {
                    (userId && userRole) ? (
                        <ConsultationRoomManager userId={userId} userRole={userRole}/>
                    ) : (
                        <Typography variant="body2" component="p">
                            userId && userRole not loaded
                        </Typography>
                    )
                }
            </Box>
        </Container>
    )
}