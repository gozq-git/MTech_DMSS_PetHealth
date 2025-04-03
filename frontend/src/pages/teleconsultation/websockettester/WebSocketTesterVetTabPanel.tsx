import React from 'react';
import {Box, Button, Chip, Grid2, List, ListItem, Paper, Stack, TextField, Typography} from '@mui/material';
import {LogEntry, VetForm, WaitingPetOwner} from "./WebSocketTester.tsx";
import {Check, Refresh, Send} from "@mui/icons-material";
import ListItemText from "@mui/material/ListItemText";

interface VetTabPanelProps {
    vetConnected: boolean;
    connectVet: () => void;
    disconnectVet: () => void;
    vetForm: VetForm;
    handleVetFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    registerVet: () => void,
    waitingList: WaitingPetOwner[];
    acceptConsultation: (petOwnerId: string) => void;
    clearVetLogs: () => void;
    vetLogsRef: React.MutableRefObject<HTMLDivElement | null>;
    vetLogs: LogEntry[];
    formatTime: (date: Date) => string;
    getLogColor: (logEntry: LogEntry['type']) => any;
}

{/* Vet Tab */
}
export const VetTabPanelContent: React.FC<VetTabPanelProps> = ({
                                                                   vetConnected,
                                                                   connectVet,
                                                                   disconnectVet,
                                                                   vetForm,
                                                                   handleVetFormChange,
                                                                   registerVet,
                                                                   waitingList,
                                                                   acceptConsultation,
                                                                   clearVetLogs, vetLogs,
                                                                   vetLogsRef,
                                                                   formatTime,
                                                                   getLogColor,
                                                               }) => {
    return (<Grid2 container spacing={3}>
        <Grid2 size={{xs:12, md:4}}>
            <Paper sx={{p: 2, display: 'flex', flexDirection: 'column'}}>
                <Typography variant="h6" gutterBottom>
                    Connection
                </Typography>
                <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                    <Typography sx={{mr: 1}}>Status:</Typography>
                    <Chip
                        label={vetConnected ? 'Connected' : 'Disconnected'}
                        color={vetConnected ? 'success' : 'error'}
                        size="small"
                    />
                </Box>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="contained"
                        onClick={connectVet}
                        disabled={vetConnected}
                    >
                        Connect
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={disconnectVet}
                        disabled={!vetConnected}
                    >
                        Disconnect
                    </Button>
                </Stack>
            </Paper>
        </Grid2>

        <Grid2 size={{xs:12, md: 8}}>
            <Paper sx={{p: 2, display: 'flex', flexDirection: 'column'}}>
                <Typography variant="h6" gutterBottom>
                    Register as Vet
                </Typography>
                <Grid2 container spacing={2}>
                    <Grid2 size={{xs:12, sm:6}}>
                        <TextField
                            fullWidth
                            label="User ID"
                            name="userId"
                            value={vetForm.userId}
                            onChange={handleVetFormChange}
                            margin="normal"
                            variant="outlined"
                            size="small"
                        />
                    </Grid2>
                    <Grid2 size={{xs:12, sm:6}}>
                        <Button
                            variant="contained"
                            onClick={registerVet}
                            disabled={!vetConnected}
                            startIcon={<Send/>}
                        >
                            Join as Vet
                        </Button>
                    </Grid2>
                </Grid2>
            </Paper>
        </Grid2>

        <Grid2 size={12}>
            <Paper sx={{p: 2, display: 'flex', flexDirection: 'column'}}>
                <Typography variant="h6" gutterBottom>
                    Waiting Pet Owners
                </Typography>
                <Paper
                    variant="outlined"
                    sx={{
                        height: 250,
                        overflow: 'auto',
                        p: 1
                    }}
                >
                    {waitingList.length === 0 ? (
                        <Typography variant="body2" sx={{color: 'text.secondary', p: 2, textAlign: 'center'}}>
                            No pet owners in waiting room.
                        </Typography>
                    ) : (
                        <List>
                            {waitingList.map((owner) => {
                                const waitTime = Math.floor((new Date().getTime() - new Date(owner.waitingSince).getTime()) / 60000);

                                return (
                                    <ListItem
                                        key={owner.id}
                                        secondaryAction={
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={() => acceptConsultation(owner.id)}
                                                disabled={!vetConnected}
                                                startIcon={<Check/>}
                                            >
                                                Accept
                                            </Button>
                                        }
                                        sx={{
                                            mb: 1,
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            borderRadius: 1
                                        }}
                                    >
                                        <ListItemText primary={owner.petInfo.name}/>
                                        <ListItemText primary={owner.petInfo.species} secondary={owner.petInfo.age}/>
                                        <ListItemText primary={owner.reason} secondary={`Waiting: ${waitTime} min`}/>
                                    </ListItem>
                                );
                            })}
                        </List>
                    )}
                </Paper>
            </Paper>
        </Grid2>

        <Grid2 size={12}>
            <Paper sx={{p: 2, display: 'flex', flexDirection: 'column'}}>
                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1}}>
                    <Typography variant="h6">
                        Vet Logs
                    </Typography>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Refresh/>}
                        onClick={clearVetLogs}
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
                    ref={vetLogsRef}
                >
                    {vetLogs.length === 0 ? (
                        <Typography variant="body2" sx={{color: 'text.secondary', p: 2, textAlign: 'center'}}>
                            No logs yet. Connect and send messages to see activity here.
                        </Typography>
                    ) : (
                        vetLogs.map((log, index) => (
                            <Box
                                key={index}
                                sx={{
                                    p: 1,
                                    borderRadius: 1,
                                    mb: 0.5,
                                    backgroundColor: 'background.paper'
                                }}
                            >
                                <Box sx={{display: 'flex', alignItems: 'center', mb: 0.5}}>
                                    <Chip
                                        label={formatTime(log.timestamp)}
                                        size="small"
                                        variant="outlined"
                                        sx={{mr: 1, fontSize: '0.7rem'}}
                                    />
                                    <Chip
                                        label={log.type}
                                        size="small"
                                        color={getLogColor(log.type)}
                                        sx={{fontSize: '0.7rem'}}
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
        </Grid2>
    </Grid2>)
}