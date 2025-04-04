import React, {useEffect, useState} from 'react';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container, Grid2,
    List,
    ListItem,
    ListItemText,
    Paper,
    Typography
} from '@mui/material';
import {VideoConsultationUI} from "./VideoConsultationUI.tsx";
import {Check} from "@mui/icons-material";

// Define interfaces for our component props and state
interface ConsultationRoomManagerProps {
    userId: string;
    userRole: 'vet' | 'pet-owner';
}

interface PetOwnerInfo {
    id: string;         // Match server's format
    waitingSince: Date; // Match server's format
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
    type: 'waiting_list_update';  // Match server's message type
    waitingPetOwners: PetOwnerInfo[];
}

interface WaitingRoomJoinedMessage extends WebSocketMessage {
    type: 'waiting_room_joined';
    position: number;
    estimatedWaitMinutes: number;
}

/**
 * ConsultationRoomManager - Manages the transition from waiting room to consultation
 *
 * This component:
 * 1. Maintains the WebSocket connection
 * 2. Listens for consultation_starting messages
 * 3. Shows the appropriate view (waiting or in consultation)
 */
export const ConsultationRoomManager: React.FC<ConsultationRoomManagerProps> = ({userId, userRole}) => {
    // WebSocket connection
    const [webSocket, setWebSocket] = useState<WebSocket | null>(null);

    // Connection state
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [connectionError, setConnectionError] = useState<string | null>(null);

    // Consultation state
    const [inConsultation, setInConsultation] = useState<boolean>(false);
    const [consultationInfo, setConsultationInfo] = useState<ConsultationInfo>({
        channelName: null,
        partnerId: null
    });

    // Waiting room state (for vets)
    const [waitingPetOwners, setWaitingPetOwners] = useState<PetOwnerInfo[]>([]);
    const [acceptingConsultation, setAcceptingConsultation] = useState<boolean>(false);

    // Pet owner wait info
    const [waitPosition, setWaitPosition] = useState<number | null>(null);
    const [estimatedWaitMinutes, setEstimatedWaitMinutes] = useState<number | null>(null);

    // Initialize WebSocket connection
    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8080');

        ws.onopen = () => {
            setIsConnected(true);
            setConnectionError(null);

            // Register with the server
            ws.send(JSON.stringify({
                type: 'register',
                userId: userId,
                role: userRole,
                // Add pet info and reason if pet owner
                ...(userRole === 'pet-owner' && {
                    petInfo: {
                        name: 'Kiyo',
                        species: 'dog',
                        age: 7
                    },
                    reason: 'Annual checkup'
                })
            }));

            console.log(`Registered as ${userRole} with ID: ${userId}`);
        };

        ws.onmessage = (event: MessageEvent) => {
            try {
                const data = JSON.parse(event.data) as WebSocketMessage;
                console.log('Received message:', data);

                // Handle consultation_starting message
                if (data.type === 'consultation_starting') {
                    const consultationData = data as ConsultationStartingMessage;

                    // Determine partner ID based on available fields and current role
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

                // Handle waiting list updates for vet
                if (data.type === 'waiting_list_update' && userRole === 'vet') {
                    const updateData = data as WaitingListUpdateMessage;
                    setWaitingPetOwners(updateData.waitingPetOwners);
                }

                // Handle waiting room updates pet owner
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

        // Cleanup on unmount
        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, [userId, userRole]);

    // Handle end consultation
    const handleConsultationEnd = (): void => {
        setInConsultation(false);
        setConsultationInfo({
            channelName: null,
            partnerId: null
        });

        // Reconnect to waiting room if needed
        if (webSocket && webSocket.readyState !== WebSocket.OPEN) {
            // Reconnect websocket
            const newSocket = new WebSocket('ws://localhost:8080');
            setWebSocket(newSocket);
        }
    };

    // Function for vet to accept consultation with a specific pet owner
    const acceptConsultation = (petOwnerId: string): void => {
        if (!webSocket || webSocket.readyState !== WebSocket.OPEN) {
            return;
        }

        setAcceptingConsultation(true);

        // Send request to start consultation - using the server's expected message format
        webSocket.send(JSON.stringify({
            type: 'accept_consultation',
            vetId: userId,
            petOwnerId: petOwnerId
        }));
    };

    // Render waiting screen or consultation
    if (!isConnected) {
        return (
            <Container maxWidth="sm" sx={{mt: 4}}>
                <Paper sx={{p: 3, textAlign: 'center'}}>
                    <CircularProgress sx={{mb: 2}}/>
                    <Typography variant="h6">
                        Connecting to server...
                    </Typography>
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

    // Render waiting room or vet dashboard
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
                                <Typography>
                                    No pet owners are currently waiting. You'll be notified when someone joins the
                                    waiting room.
                                </Typography>
                            ) : (
                                <List sx={{ width: '100%' }}>
                                    {waitingPetOwners.map((petOwner) => {
                                        const waitTime = Math.floor((new Date().getTime() - new Date(petOwner.waitingSince).getTime()) / 60000);
                                        return (
                                            <ListItem
                                                key={petOwner.id}
                                                secondaryAction={
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        onClick={() => acceptConsultation(petOwner.id)}
                                                        disabled={acceptingConsultation}
                                                        startIcon={<Check/>}
                                                    >
                                                        {acceptingConsultation ? 'Connecting...' : 'Accept Consultation'}
                                                    </Button>
                                                }
                                                sx={{
                                                    mb: 1,
                                                    border: '1px solid',
                                                    borderColor: 'divider',
                                                    borderRadius: 1
                                                }}
                                            >
                                                <ListItemText primary={petOwner.petInfo.name}/>
                                                <ListItemText primary={petOwner.petInfo.species}
                                                              secondary={petOwner.petInfo.age}/>
                                                <ListItemText primary={petOwner.reason}
                                                              secondary={`Waiting: ${waitTime} min`}/>
                                            </ListItem>
                                        );
                                    })}
                                </List>
                            )}
                        </Box>
                    )}
                </Grid2>
            </Paper>
        </Container>
    );
};