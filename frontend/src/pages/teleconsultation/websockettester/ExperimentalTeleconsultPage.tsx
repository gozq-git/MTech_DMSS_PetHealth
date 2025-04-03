import React from 'react';
import {
    Box,
    Container,
    Typography,

} from '@mui/material';
import {ConsultationRoomManager} from "./ConsultationRoomManager.tsx";

interface TeleconsultPageProps {
    userId: string;
    userRole: 'vet' | 'pet-owner';
}

export const ExperimentalTeleconsultPage: React.FC<TeleconsultPageProps> = ({userId, userRole}) => {

    return (
        <Container maxWidth="xl" sx={{mt: 4, mb: 4}}>
            <Box>
                <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 3}}>
                    <Typography variant="h4" component="h1">
                        Vet Teleconsultation Service
                    </Typography>
                </Box>
                <ConsultationRoomManager userId={userId} userRole={userRole}/>
            </Box>
        </Container>
    )
}