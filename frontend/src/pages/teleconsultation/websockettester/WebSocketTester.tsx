import React, {useEffect, useRef, useState} from 'react';
import {
    Alert,
    Box,
    Button,
    Chip,
    Container,
    Divider,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    Snackbar,
    Stack,
    Tab,
    Tabs,
    TextField,
    Typography
} from '@mui/material';
import {LocalHospital, Pets, Refresh, Send} from "@mui/icons-material";
import {VetTabPanelContent} from "./VetTabPanel.tsx";

// Define TypeScript interfaces for our data structures
interface PetOwnerForm {
    userId: string;
    petName: string;
    petSpecies: string;
    petAge: number;
    reason: string;
}

export interface VetForm {
    userId: string;
}

interface PetInfo {
    name: string;
    species: string;
    age: number;
}

export interface WaitingPetOwner {
    id: string;
    waitingSince: string;
    petInfo: PetInfo;
    reason: string;
}

export interface LogEntry {
    message: string;
    type: 'info' | 'sent' | 'received' | 'error';
    timestamp: Date;
}

interface NotificationState {
    open: boolean;
    message: string;
    severity: 'success' | 'info' | 'warning' | 'error';
}

// WebSocketTester Component
const WebSocketTester: React.FC = () => {
    // State for tab value
    const [tabValue, setTabValue] = useState<number>(0);

    // WebSocket connections
    const [petOwnerWs, setPetOwnerWs] = useState<WebSocket | null>(null);
    const [vetWs, setVetWs] = useState<WebSocket | null>(null);

    // Connection status
    const [petOwnerConnected, setPetOwnerConnected] = useState<boolean>(false);
    const [vetConnected, setVetConnected] = useState<boolean>(false);

    // Form states
    const [petOwnerForm, setPetOwnerForm] = useState<PetOwnerForm>({
        userId: 'userId-001',
        petName: 'Kiyo',
        petSpecies: 'dog',
        petAge: 7,
        reason: 'Annual checkup'
    });

    const [vetForm, setVetForm] = useState<VetForm>({
        userId: 'Vet001'
    });

    // Message logs
    const [petOwnerLogs, setPetOwnerLogs] = useState<LogEntry[]>([]);
    const [vetLogs, setVetLogs] = useState<LogEntry[]>([]);

    // Waiting list
    const [waitingList, setWaitingList] = useState<WaitingPetOwner[]>([]);

    // Custom message
    const [customMessage, setCustomMessage] = useState<string>('');
    const [messageTarget, setMessageTarget] = useState<'petOwner' | 'vet'>('petOwner');

    // Notification state
    const [notification, setNotification] = useState<NotificationState>({
        open: false,
        message: '',
        severity: 'info'
    });

    // Refs for log containers to scroll to bottom
    const petOwnerLogsRef = useRef<HTMLDivElement | null>(null);
    const vetLogsRef = useRef<HTMLDivElement | null>(null);

    // Handle tab change
    const handleTabChange = (_event: React.SyntheticEvent, newValue: number): void => {
        setTabValue(newValue);
    };

    // Connect pet owner WebSocket
    const connectPetOwner = (): void => {
        try {
            const ws = new WebSocket('ws://localhost:8080');

            ws.onopen = () => {
                setPetOwnerWs(ws);
                setPetOwnerConnected(true);
                addPetOwnerLog('Connected to WebSocket server', 'info');
                setNotification({
                    open: true,
                    message: 'Pet Owner connected successfully',
                    severity: 'success'
                });
            };

            ws.onmessage = (event: MessageEvent) => {
                const data = JSON.parse(event.data);
                addPetOwnerLog(`Received: ${event.data}`, 'received');

                // Handle specific message types
                if (data.type === 'waiting_room_joined') {
                    setNotification({
                        open: true,
                        message: `Joined waiting room. Position: ${data.position}. Est. wait: ${data.estimatedWaitMinutes} min`,
                        severity: 'info'
                    });
                } else if (data.type === 'consultation_starting') {
                    setNotification({
                        open: true,
                        message: `Consultation starting with Vet ${data.vetId}!`,
                        severity: 'success'
                    });
                }
            };

            ws.onclose = () => {
                setPetOwnerConnected(false);
                addPetOwnerLog('Disconnected from WebSocket server', 'error');
                setNotification({
                    open: true,
                    message: 'Pet Owner disconnected',
                    severity: 'warning'
                });
            };

            ws.onerror = (error: Event) => {
                addPetOwnerLog(`WebSocket error: ${error.type}`, 'error');
                setNotification({
                    open: true,
                    message: 'Connection error',
                    severity: 'error'
                });
            };
        } catch (error) {
            setNotification({
                open: true,
                message: `Failed to connect: ${error instanceof Error ? error.message : String(error)}`,
                severity: 'error'
            });
        }
    };

    // Connect vet WebSocket
    const connectVet = (): void => {
        try {
            const ws = new WebSocket('ws://localhost:8080');

            ws.onopen = () => {
                setVetWs(ws);
                setVetConnected(true);
                addVetLog('Connected to WebSocket server', 'info');
                setNotification({
                    open: true,
                    message: 'Vet connected successfully',
                    severity: 'success'
                });
            };

            ws.onmessage = (event: MessageEvent) => {
                const data = JSON.parse(event.data);
                addVetLog(`Received: ${event.data}`, 'received');

                // Handle specific message types
                if (data.type === 'waiting_list_update') {
                    setWaitingList(data.waitingPetOwners || []);
                } else if (data.type === 'consultation_starting') {
                    setNotification({
                        open: true,
                        message: `Consultation starting with Pet Owner ${data.petOwnerId}!`,
                        severity: 'success'
                    });
                }
            };

            ws.onclose = () => {
                setVetConnected(false);
                addVetLog('Disconnected from WebSocket server', 'error');
                setNotification({
                    open: true,
                    message: 'Vet disconnected',
                    severity: 'warning'
                });
            };

            ws.onerror = (error: Event) => {
                addVetLog(`WebSocket error: ${error.type}`, 'error');
                setNotification({
                    open: true,
                    message: 'Connection error',
                    severity: 'error'
                });
            };
        } catch (error) {
            setNotification({
                open: true,
                message: `Failed to connect: ${error instanceof Error ? error.message : String(error)}`,
                severity: 'error'
            });
        }
    };

    // Disconnect WebSockets
    const disconnectPetOwner = (): void => {
        if (petOwnerWs) {
            petOwnerWs.close();
            setPetOwnerWs(null);
        }
    };

    const disconnectVet = (): void => {
        if (vetWs) {
            vetWs.close();
            setVetWs(null);
        }
    };

    // Register pet owner
    const registerPetOwner = (): void => {
        if (!petOwnerWs || petOwnerWs.readyState !== WebSocket.OPEN) {
            setNotification({
                open: true,
                message: 'Not connected to server',
                severity: 'error'
            });
            return;
        }

        const message = {
            type: 'register',
            userId: petOwnerForm.userId,
            role: 'pet-owner',
            petInfo: {
                name: petOwnerForm.petName,
                species: petOwnerForm.petSpecies,
                age: parseInt(String(petOwnerForm.petAge))
            },
            reason: petOwnerForm.reason
        };

        petOwnerWs.send(JSON.stringify(message));
        addPetOwnerLog(`Sent: ${JSON.stringify(message)}`, 'sent');
    };

    // Register vet
    const registerVet = (): void => {
        if (!vetWs || vetWs.readyState !== WebSocket.OPEN) {
            setNotification({
                open: true,
                message: 'Not connected to server',
                severity: 'error'
            });
            return;
        }

        const message = {
            type: 'register',
            userId: vetForm.userId,
            role: 'vet'
        };

        vetWs.send(JSON.stringify(message));
        addVetLog(`Sent: ${JSON.stringify(message)}`, 'sent');
    };

    // Accept consultation
    const acceptConsultation = (petOwnerId: string): void => {
        if (!vetWs || vetWs.readyState !== WebSocket.OPEN) {
            setNotification({
                open: true,
                message: 'Not connected to server',
                severity: 'error'
            });
            return;
        }

        const message = {
            type: 'accept_consultation',
            vetId: vetForm.userId,
            petOwnerId: petOwnerId
        };

        vetWs.send(JSON.stringify(message));
        addVetLog(`Sent: ${JSON.stringify(message)}`, 'sent');
    };

    // Send custom message
    const sendCustomMessage = (): void => {
        try {
            const ws = messageTarget === 'petOwner' ? petOwnerWs : vetWs;
            const connected = messageTarget === 'petOwner' ? petOwnerConnected : vetConnected;

            if (!connected || !ws || ws.readyState !== WebSocket.OPEN) {
                setNotification({
                    open: true,
                    message: `${messageTarget === 'petOwner' ? 'Pet Owner' : 'Vet'} not connected`,
                    severity: 'error'
                });
                return;
            }

            const message = JSON.parse(customMessage);
            ws.send(JSON.stringify(message));

            if (messageTarget === 'petOwner') {
                addPetOwnerLog(`Sent: ${JSON.stringify(message)}`, 'sent');
            } else {
                addVetLog(`Sent: ${JSON.stringify(message)}`, 'sent');
            }

            setNotification({
                open: true,
                message: 'Message sent successfully',
                severity: 'success'
            });
        } catch (error) {
            setNotification({
                open: true,
                message: `Error: ${error instanceof Error ? error.message : String(error)}`,
                severity: 'error'
            });
        }
    };

    // Check server status
    const checkServerStatus = async (): Promise<void> => {
        try {
            const response = await fetch('http://localhost:8080/status');
            const data = await response.json();

            setNotification({
                open: true,
                message: `Server status: ${data.status}, Waiting: ${data.waitingPetOwners}, Vets: ${data.activeVets}`,
                severity: 'info'
            });
        } catch (error) {
            setNotification({
                open: true,
                message: `Server status check failed: ${error instanceof Error ? error.message : String(error)}`,
                severity: 'error'
            });
        }
    };

    // Add log message for pet owner
    const addPetOwnerLog = (message: string, type: LogEntry['type']): void => {
        setPetOwnerLogs(prevLogs => [
            ...prevLogs,
            { message, type, timestamp: new Date() }
        ]);
    };

    // Add log message for vet
    const addVetLog = (message: string, type: LogEntry['type']): void => {
        setVetLogs(prevLogs => [
            ...prevLogs,
            { message, type, timestamp: new Date() }
        ]);
    };

    // Clear logs
    const clearPetOwnerLogs = (): void => {
        setPetOwnerLogs([]);
    };

    const clearVetLogs = (): void => {
        setVetLogs([]);
    };

    // Handle pet owner form changes
    const handlePetOwnerFormChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setPetOwnerForm(prev => ({
            ...prev,
            [name]: name === 'petAge' ? Number(value) : value
        }));
    };

    // Handle vet form changes
    const handleVetFormChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setVetForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Auto-scroll logs to bottom
    useEffect(() => {
        if (petOwnerLogsRef.current) {
            petOwnerLogsRef.current.scrollTop = petOwnerLogsRef.current.scrollHeight;
        }
    }, [petOwnerLogs]);

    useEffect(() => {
        if (vetLogsRef.current) {
            vetLogsRef.current.scrollTop = vetLogsRef.current.scrollHeight;
        }
    }, [vetLogs]);

    // Handle notification close
    const handleNotificationClose = (_event?: React.SyntheticEvent | Event, reason?: string): void => {
        if (reason === 'clickaway') {
            return;
        }

        setNotification(prev => ({
            ...prev,
            open: false
        }));
    };

    // Format timestamp
    const formatTime = (date: Date): string => {formatTime
        return date.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    // Get color for log type
    const getLogColor = (type: LogEntry['type']): 'primary' | 'info' | 'success' | 'error' | 'default' => {
        switch(type) {
            case 'info': return 'primary';
            case 'sent': return 'info';
            case 'received': return 'success';
            case 'error': return 'error';
            default: return 'default';
        }
    };

    // Handle message target change
    const handleMessageTargetChange = (event: SelectChangeEvent): void => {
        setMessageTarget(event.target.value as 'petOwner' | 'vet');
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                WebSocket Tester
            </Typography>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="websocket test tabs">
                    <Tab label="Pet Owner" icon={<Pets />} iconPosition="start" />
                    <Tab label="Veterinarian" icon={<LocalHospital />} iconPosition="start" />
                    <Tab label="System" />
                </Tabs>
            </Box>

            {/* Pet Owner Tab */}
            <div role="tabpanel" hidden={tabValue !== 0}>
                {tabValue === 0 && (
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                                <Typography variant="h6" gutterBottom>
                                    Connection
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Typography sx={{ mr: 1 }}>Status:</Typography>
                                    <Chip
                                        label={petOwnerConnected ? 'Connected' : 'Disconnected'}
                                        color={petOwnerConnected ? 'success' : 'error'}
                                        size="small"
                                    />
                                </Box>
                                <Stack direction="row" spacing={2}>
                                    <Button
                                        variant="contained"
                                        onClick={connectPetOwner}
                                        disabled={petOwnerConnected}
                                    >
                                        Connect
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={disconnectPetOwner}
                                        disabled={!petOwnerConnected}
                                    >
                                        Disconnect
                                    </Button>
                                </Stack>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={8}>
                            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                                <Typography variant="h6" gutterBottom>
                                    Register as Pet Owner
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="User ID"
                                            name="userId"
                                            value={petOwnerForm.userId}
                                            onChange={handlePetOwnerFormChange}
                                            margin="normal"
                                            variant="outlined"
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Pet Name"
                                            name="petName"
                                            value={petOwnerForm.petName}
                                            onChange={handlePetOwnerFormChange}
                                            margin="normal"
                                            variant="outlined"
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Pet Species"
                                            name="petSpecies"
                                            value={petOwnerForm.petSpecies}
                                            onChange={handlePetOwnerFormChange}
                                            margin="normal"
                                            variant="outlined"
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Pet Age"
                                            name="petAge"
                                            type="number"
                                            value={petOwnerForm.petAge}
                                            onChange={handlePetOwnerFormChange}
                                            margin="normal"
                                            variant="outlined"
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Reason for Visit"
                                            name="reason"
                                            value={petOwnerForm.reason}
                                            onChange={handlePetOwnerFormChange}
                                            margin="normal"
                                            variant="outlined"
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button
                                            variant="contained"
                                            onClick={registerPetOwner}
                                            disabled={!petOwnerConnected}
                                            startIcon={<Send />}
                                        >
                                            Join Waiting Room
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                        <Grid item xs={12}>
                            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                    <Typography variant="h6">
                                        Pet Owner Logs
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<Refresh />}
                                        onClick={clearPetOwnerLogs}
                                    >
                                        Clear
                                    </Button>
                                </Box>
                                <Paper
                                    variant="outlined"
                                    sx={{
                                        height: 250,
                                        overflow: 'auto',
                                        p: 1,
                                        backgroundColor: '#f5f5f5'
                                    }}
                                    ref={petOwnerLogsRef}
                                >
                                    {petOwnerLogs.length === 0 ? (
                                        <Typography variant="body2" sx={{ color: 'text.secondary', p: 2, textAlign: 'center' }}>
                                            No logs yet. Connect and send messages to see activity here.
                                        </Typography>
                                    ) : (
                                        petOwnerLogs.map((log, index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    p: 1,
                                                    borderRadius: 1,
                                                    mb: 0.5,
                                                    backgroundColor: 'background.paper'
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                                    <Chip
                                                        label={log.timestamp.toLocaleString()}
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{ mr: 1, fontSize: '0.7rem' }}
                                                    />
                                                    <Chip
                                                        label={log.type}
                                                        size="small"
                                                        color={getLogColor(log.type)}
                                                        sx={{ fontSize: '0.7rem' }}
                                                    />
                                                </Box>
                                                <Typography
                                                    variant="body2"
                                                    component="pre"
                                                    sx={{
                                                        whiteSpace: 'pre-wrap',
                                                        wordBreak: 'break-word',
                                                        m: 0
                                                    }}
                                                >
                                                    {log.message}
                                                </Typography>
                                            </Box>
                                        ))
                                    )}
                                </Paper>
                            </Paper>
                        </Grid>
                    </Grid>
                )}
            </div>

            {/* Vet Tab*/}
            <div role="tabpanel" hidden={tabValue !== 1}>
                {tabValue === 1 && (
                   <VetTabPanelContent
                       vetConnected={vetConnected}
                       connectVet={connectVet}
                       disconnectVet={disconnectVet}
                       vetForm={vetForm}
                       handleVetFormChange={handleVetFormChange}
                       registerVet={registerVet}
                       waitingList={waitingList}
                       acceptConsultation={acceptConsultation}
                       clearVetLogs={clearVetLogs}
                       vetLogsRef={vetLogsRef}
                       vetLogs={vetLogs}
                       formatTime={formatTime}
                       getLogColor={getLogColor}
                   />
                )}
            </div>

            {/* System Tab */}
            <div role="tabpanel" hidden={tabValue !== 2}>
                {tabValue === 2 && (
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                                <Typography variant="h6" gutterBottom>
                                    Send Custom Message
                                </Typography>
                                <FormControl fullWidth margin="normal" size="small">
                                    <InputLabel id="message-target-label">Target</InputLabel>
                                    <Select
                                        labelId="message-target-label"
                                        value={messageTarget}
                                        label="Target"
                                        onChange={handleMessageTargetChange}
                                    >
                                        <MenuItem value="petOwner">Pet Owner</MenuItem>
                                        <MenuItem value="vet">Veterinarian</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField
                                    label="Message (JSON format)"
                                    multiline
                                    rows={6}
                                    value={customMessage}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomMessage(e.target.value)}
                                    margin="normal"
                                    variant="outlined"
                                    fullWidth
                                    placeholder={`Example: ${JSON.stringify({
                                        type: 'register',
                                        userId: 'user123',
                                        role: messageTarget === 'petOwner' ? 'pet-owner' : 'vet'
                                    }, null, 2)}`}
                                />
                                <Button
                                    variant="contained"
                                    onClick={sendCustomMessage}
                                    disabled={(messageTarget === 'petOwner' && !petOwnerConnected) ||
                                        (messageTarget === 'vet' && !vetConnected)}
                                    startIcon={<Send />}
                                    sx={{ mt: 2 }}
                                >
                                    Send Message
                                </Button>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                                <Typography variant="h6" gutterBottom>
                                    Server Status
                                </Typography>
                                <Button
                                    variant="contained"
                                    onClick={checkServerStatus}
                                    startIcon={<Refresh />}
                                    sx={{ alignSelf: 'flex-start', mb: 2 }}
                                >
                                    Check Status
                                </Button>

                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Connection Info
                                    </Typography>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2">WebSocket URL:</Typography>
                                        <TextField
                                            value="ws://localhost:8080"
                                            fullWidth
                                            size="small"
                                            margin="dense"
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        />
                                    </Box>

                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2">HTTP Status URL:</Typography>
                                        <TextField
                                            value="http://localhost:8080/status"
                                            fullWidth
                                            size="small"
                                            margin="dense"
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        />
                                    </Box>

                                    <Divider sx={{ my: 2 }} />

                                    <Typography variant="h6" gutterBottom>
                                        Message Templates
                                    </Typography>

                                    <Typography variant="subtitle2" gutterBottom>
                                        Available message types:
                                    </Typography>

                                    <Grid container spacing={1} sx={{ mb: 2 }}>
                                        {['register', 'accept_consultation', 'join', 'send_offer', 'send_answer'].map((type) => (
                                            <Grid item key={type}>
                                                <Chip
                                                    label={type}
                                                    onClick={() => {
                                                        let template: Record<string, any> = {};

                                                        switch(type) {
                                                            case 'register':
                                                                template = messageTarget === 'petOwner'
                                                                    ? {
                                                                        type: 'register',
                                                                        userId: petOwnerForm.userId,
                                                                        role: 'pet-owner',
                                                                        petInfo: {
                                                                            name: petOwnerForm.petName,
                                                                            species: petOwnerForm.petSpecies,
                                                                            age: parseInt(String(petOwnerForm.petAge))
                                                                        },
                                                                        reason: petOwnerForm.reason
                                                                    }
                                                                    : {
                                                                        type: 'register',
                                                                        userId: vetForm.userId,
                                                                        role: 'vet'
                                                                    };
                                                                break;
                                                            case 'accept_consultation':
                                                                template = {
                                                                    type: 'accept_consultation',
                                                                    vetId: vetForm.userId,
                                                                    petOwnerId: 'owner123'
                                                                };
                                                                break;
                                                            case 'join':
                                                                template = {
                                                                    type: 'join',
                                                                    channelName: 'consult-' + Date.now(),
                                                                    userId: messageTarget === 'petOwner' ? petOwnerForm.userId : vetForm.userId
                                                                };
                                                                break;
                                                            case 'send_offer':
                                                                template = {
                                                                    type: 'send_offer',
                                                                    channelName: 'consult-1712158439123',
                                                                    offer: {
                                                                        type: 'offer',
                                                                        sdp: 'v=0\r\no=- 2541565284 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0...'
                                                                    }
                                                                };
                                                                break;
                                                            case 'send_answer':
                                                                template = {
                                                                    type: 'send_answer',
                                                                    channelName: 'consult-1712158439123',
                                                                    answer: {
                                                                        type: 'answer',
                                                                        sdp: 'v=0\r\no=- 1654531657 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0...'
                                                                    }
                                                                };
                                                                break;
                                                            default:
                                                                template = { type };
                                                        }

                                                        setCustomMessage(JSON.stringify(template, null, 2));
                                                    }}
                                                    color="primary"
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                )}
            </div>

            {/* Notification Snackbar */}
            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={handleNotificationClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleNotificationClose}
                    severity={notification.severity}
                    sx={{ width: '100%' }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default WebSocketTester;
