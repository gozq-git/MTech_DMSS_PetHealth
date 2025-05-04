import React, {useEffect, useState} from 'react';
import {Alert, Box, Button, CircularProgress, Container, Grid2, List, Paper, Typography} from '@mui/material';
import {VideoConsultationUI} from './VideoConsultationUI.tsx';
import {Check} from '@mui/icons-material';
import {FeesPage} from '../../payment/FeesPage'; // updated the path to the correct location

// Define interfaces for our component props and state
interface ConsultationRoomManagerProps {
    userId: string;
    userRole: 'vet' | 'pet-owner';
    appointmentId: string | null; // Added appointmentId prop
}

interface PetOwnerInfo {
    id: string;
    waitingSince: Date;
    petInfo: {
        name: string;
        species: string;
        age: number;
    };
    reason: string;
}

interface ConsultationInfo {
    channelName: string | null;
    partnerId: string | null;
}

interface WebSocketMessage {
    type: string;

    [key: string]: any;
}

interface ConsultationStartingMessage extends WebSocketMessage {
    type: 'consultation_starting';
    channelName: string;
    vetId?: string;
    petOwnerId?: string;
}

interface WaitingListUpdateMessage extends WebSocketMessage {
    type: 'waiting_list_update';
    waitingPetOwners: PetOwnerInfo[];
}

interface WaitingRoomJoinedMessage extends WebSocketMessage {
    type: 'waiting_room_joined';
    position: number;
    estimatedWaitMinutes: number;
}

export const ConsultationRoomManager: React.FC<ConsultationRoomManagerProps> = ({userId, userRole, appointmentId}) => {
    const [webSocket, setWebSocket] = useState<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [connectionError, setConnectionError] = useState<string | null>(null);
    const [inConsultation, setInConsultation] = useState<boolean>(false);
    const [consultationInfo, setConsultationInfo] = useState<ConsultationInfo>({
        channelName: null,
        partnerId: null
    });
    const [waitingPetOwners, setWaitingPetOwners] = useState<PetOwnerInfo[]>([]);
    const [acceptingConsultation, setAcceptingConsultation] = useState<boolean>(false);
    const [waitPosition, setWaitPosition] = useState<number | null>(null);
    const [estimatedWaitMinutes, setEstimatedWaitMinutes] = useState<number | null>(null);

    useEffect(() => {
        const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL;
        console.info(WEBSOCKET_URL);
        const ws = new WebSocket(WEBSOCKET_URL);

        ws.onopen = () => {
            setIsConnected(true);
            setConnectionError(null);

            ws.send(
                JSON.stringify({
                    type: 'register',
                    userId: userId,
                    role: userRole,
                    appointmentId: appointmentId, // Send appointmentId to the server
                    ...(userRole === 'pet-owner' && {
                        petInfo: {
                            name: 'Kiyo',
                            species: 'dog',
                            age: 7
                        },
                        reason: 'Annual checkup'
                    })
                })
            );

            console.log(`Registered as ${userRole} with ID: ${userId} for appointment: ${appointmentId}`);
        };

        ws.onmessage = (event: MessageEvent) => {
            try {
                const data = JSON.parse(event.data) as WebSocketMessage;
                console.log('Received message:', data);

                if (data.type === 'consultation_starting') {
                    const consultationData = data as ConsultationStartingMessage;
                    let partnerId: string | null = null;

                    if (userRole === 'pet-owner' && consultationData.vetId) {
                        partnerId = consultationData.vetId;
                    } else if (userRole === 'vet' && consultationData.petOwnerId) {
                        partnerId = consultationData.petOwnerId;
                    }

                    if (partnerId) {
                        setConsultationInfo({
                            channelName: consultationData.channelName,
                            partnerId: partnerId
                        });

                        setInConsultation(true);
                        setAcceptingConsultation(false);
                        console.log(`Starting consultation with ${partnerId} in channel ${consultationData.channelName}`);
                    }
                }

                if (data.type === 'waiting_list_update' && userRole === 'vet') {
                    const updateData = data as WaitingListUpdateMessage;
                    setWaitingPetOwners(updateData.waitingPetOwners);
                }

                if (data.type === 'waiting_room_joined' && userRole === 'pet-owner') {
                    const joinData = data as WaitingRoomJoinedMessage;
                    setWaitPosition(joinData.position);
                    setEstimatedWaitMinutes(joinData.estimatedWaitMinutes);
                }
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };

        ws.onclose = () => {
            setIsConnected(false);
            console.log('WebSocket connection closed');
        };

        ws.onerror = (error: Event) => {
            setConnectionError('Failed to connect to the server. Please try again later.');
            console.error('WebSocket error:', error);
        };

        setWebSocket(ws);

        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, [userId, userRole, appointmentId]);

    const [showFeeModal, setShowFeeModal] = useState(false);

    const handleConsultationEnd = (): void => {
        setInConsultation(false);
        setConsultationInfo({
            channelName: null,
            partnerId: null
        });
        setShowFeeModal(true); // Show the price popup

        if (webSocket && webSocket.readyState !== WebSocket.OPEN) {
            const newSocket = new WebSocket('ws://localhost:8080');
            setWebSocket(newSocket);
        }
    };

    const acceptConsultation = (petOwnerId: string): void => {
        if (!webSocket || webSocket.readyState !== WebSocket.OPEN) {
            return;
        }

        setAcceptingConsultation(true);

        webSocket.send(
            JSON.stringify({
                type: 'accept_consultation',
                vetId: userId,
                petOwnerId: petOwnerId
            })
        );
    };

    if (!isConnected) {
        return (
            <Container maxWidth="sm" sx={{mt: 4}}>
                <Paper sx={{p: 3, textAlign: 'center'}}>
                    <CircularProgress sx={{mb: 2}}/>
                    <Typography variant="h6">Connecting to server...</Typography>
                    {connectionError && (
                        <Typography color="error" sx={{mt: 2}}>
                            {connectionError}
                        </Typography>
                    )}
                </Paper>
            </Container>
        );
    }

    if (inConsultation && consultationInfo.channelName && consultationInfo.partnerId && webSocket) {
        return (
            <VideoConsultationUI
                userId={userId}
                role={userRole}
                partnerId={consultationInfo.partnerId}
                channelName={consultationInfo.channelName}
                ws={webSocket}
                onConsultationEnd={handleConsultationEnd}
            />
        );
    }

    return (
        <Container maxWidth="xl" sx={{mt: 4}}>
            <Paper sx={{p: 3}}>
                <Grid2 container spacing={2}>
                    <Grid2 size={12}>
                        <Typography variant="h5" gutterBottom>
                            Waiting Room
                        </Typography>
                    </Grid2>

                    {userRole === 'pet-owner' && (
                        <Box sx={{mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1}}>
                            <Typography variant="h6" gutterBottom>
                                You're in the waiting room
                            </Typography>
                            <Typography>
                                Please wait while a veterinarian becomes available. You'll automatically be connected
                                when it's your turn.
                            </Typography>

                            {waitPosition !== null && (
                                <Alert severity="info" sx={{mt: 2}}>
                                    Your position in queue: {waitPosition}
                                    {estimatedWaitMinutes !== null && (
                                        <span> • Estimated wait: {estimatedWaitMinutes} minutes</span>
                                    )}
                                </Alert>
                            )}

                            <Box sx={{mt: 2, display: 'flex', alignItems: 'center'}}>
                                <CircularProgress size={24} sx={{mr: 2}}/>
                                <Typography variant="body2" color="text.secondary">
                                    Waiting for a veterinarian...
                                </Typography>
                            </Box>
                        </Box>
                    )}

                    {userRole === 'vet' && (
                        <Box sx={{mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1}}>
                            <Typography variant="h6" gutterBottom>
                                Waiting Pet Owners
                            </Typography>

                            {waitingPetOwners.length === 0 ? (
                                <Typography>No pet owners are currently waiting.</Typography>
                            ) : (
                                <Grid2 container spacing={2}>
                                    {waitingPetOwners.map((petOwner) => {
                                        const waitTime = Math.floor((new Date().getTime() - new Date(petOwner.waitingSince).getTime()) / 60000);
                                        return (
                                            <>
                                                <Grid2 size={4}>
                                                    <Typography variant="body2" component="div">
                                                        {`${petOwner.petInfo.name}(${petOwner.petInfo.species})`}
                                                    </Typography>
                                                </Grid2>
                                                <Grid2 size={2}>
                                                    <Typography variant="body2" component="div">
                                                        {petOwner.reason}
                                                    </Typography>
                                                </Grid2>
                                                <Grid2 size={3}>
                                                    <Typography variant="body2" component="div">
                                                        {`Wait time: ${waitTime} min`}
                                                    </Typography>
                                                </Grid2>

                                                <Grid2 size={3}>
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        onClick={() => acceptConsultation(petOwner.id)}
                                                        disabled={acceptingConsultation}
                                                        startIcon={<Check/>}
                                                    >
                                                        {acceptingConsultation ? 'Connecting...' : 'Accept'}
                                                    </Button>
                                                </Grid2>
                                            </>
                                        );
                                    })}
                                </Grid2>
                            )}
                        </Box>
                    )}
                </Grid2>
            </Paper>
            <FeesPage open={showFeeModal} onClose={() => setShowFeeModal(false)}/>
        </Container>
    );
};
