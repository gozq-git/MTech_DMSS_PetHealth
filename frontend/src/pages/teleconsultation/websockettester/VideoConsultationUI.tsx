import React, { useEffect, useRef, useState } from 'react';
import {
    Box, Button, Card, Container, Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle, IconButton, Paper, Stack, Typography, Grid2
} from '@mui/material';
import { CallEnd, Mic, MicOff, Videocam, VideocamOff } from '@mui/icons-material';

interface VideoConsultationUIProps {
    userId: string;
    role: 'vet' | 'pet-owner';
    partnerId: string;
    channelName: string;
    ws: WebSocket;
    onConsultationEnd: () => void;
}

export const VideoConsultationUI: React.FC<VideoConsultationUIProps> = ({
                                                                            userId,
                                                                            role,
                                                                            partnerId,
                                                                            channelName,
                                                                            ws,
                                                                            onConsultationEnd
                                                                        }) => {
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);

    const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'failed'>('connecting');
    const [isMuted, setIsMuted] = useState<boolean>(false);
    const [isVideoOff, setIsVideoOff] = useState<boolean>(false);
    const [callDuration, setCallDuration] = useState<number>(0);
    const [timerInterval, setTimerInterval] = useState<number | null>(null);
    const [showReconnectDialog, setShowReconnectDialog] = useState<boolean>(false);

    // Store ICE candidates that arrive before the remote description
    const [pendingIceCandidates, setPendingIceCandidates] = useState<RTCIceCandidateInit[]>([]);

    // Fetch TURN server credentials from Metered
    const fetchTurnServerCredentials = async () => {
        try {
            // Get the API key from environment variables
            const meteredTurnServerApiKey = import.meta.env.VITE_METERED_API_KEY;

            if (!meteredTurnServerApiKey) {
                console.warn('Metered TURN API key not found, using default STUN servers only');
                return {
                    iceServers: [
                        { urls: 'stun:stun.l.google.com:19302' },
                        { urls: 'stun:stun1.l.google.com:19302' }
                    ]
                };
            }

            const response = await fetch(
                `https://xeyndev.metered.live/api/v1/turn/credentials?apiKey=${meteredTurnServerApiKey}`
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch TURN credentials: ${response.status}`);
            }

            const turnServers = await response.json();
            console.log('Retrieved TURN servers:', turnServers);

            return {
                iceServers: turnServers
            };
        } catch (error) {
            console.error('Error fetching TURN credentials:', error);
            // Fallback to STUN servers only
            return {
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:stun1.l.google.com:19302' }
                ]
            };
        }
    };

    // Create RTC peer connection and set up local media
    useEffect(() => {
        const setupLocalStream = async () => {
            try {
                // Request access to user's camera and microphone
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                localStreamRef.current = stream;

                // Display local video
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }

                // Fetch ICE server configuration with TURN credentials
                const configuration = await fetchTurnServerCredentials();

                const peerConnection = new RTCPeerConnection(configuration);
                peerConnectionRef.current = peerConnection;

                // Add local tracks to the RTCPeerConnection
                stream.getTracks().forEach(track => {
                    if (peerConnectionRef.current) {
                        peerConnectionRef.current.addTrack(track, stream);
                    }
                });

                // Set up event handlers for the peer connection
                setupPeerConnectionEvents();

                // Join the channel and start signaling
                joinChannel();

                // Start call as offerer (vet) or wait for offer (pet owner)
                if (role === 'vet') {
                    createOffer();
                }

                // Start call timer
                const interval = window.setInterval(() => {
                    setCallDuration(prev => prev + 1);
                }, 1000);

                setTimerInterval(interval);

            } catch (error) {
                console.error('Error setting up media devices:', error);
                setConnectionStatus('failed');
            }
        };

        setupLocalStream();

        // Cleanup function
        return () => {
            // Stop all tracks in local stream
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(track => track.stop());
            }

            // Close peer connection
            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
            }

            // Clear timer
            if (timerInterval) {
                clearInterval(timerInterval);
            }
        };
    }, []);

    // Set up WebSocket message handler for signaling
    useEffect(() => {
        const handleWebSocketMessage = (event: MessageEvent) => {
            try {
                const data = JSON.parse(event.data);
                console.log('WebSocket message received:', data.type);

                switch (data.type) {
                    case 'send_offer':
                        if (role === 'pet-owner' && peerConnectionRef.current && data.recipient === userId) {
                            handleReceivedOffer(data);
                        }
                        break;
                    case 'send_answer':
                        if (role === 'vet' && peerConnectionRef.current && data.recipient === userId) {
                            handleReceivedAnswer(data);
                        }
                        break;
                    case 'ice_candidate':
                        handleIceCandidate(data);
                        break;
                    case 'peer_disconnected':
                        handlePeerDisconnected();
                        break;
                }
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };

        // Add message event listener
        ws.addEventListener('message', handleWebSocketMessage);

        // Add a fallback timer to check connection status after a reasonable time
        const connectionTimer = setTimeout(() => {
            // If we're still in connecting state after 15 seconds but have video,
            // force the status to connected
            if (connectionStatus === 'connecting' && remoteVideoRef.current?.srcObject) {
                console.log('Connection status still spinning after timeout - force updating to connected');
                setConnectionStatus('connected');
            }
        }, 15000);

        // Cleanup function
        return () => {
            ws.removeEventListener('message', handleWebSocketMessage);
            clearTimeout(connectionTimer);
        };
    }, [ws, role, connectionStatus]);

    const setupPeerConnectionEvents = () => {
        if (!peerConnectionRef.current) return;

        // Handle ICE candidates
        peerConnectionRef.current.onicecandidate = (event) => {
            if (event.candidate) {
                // Send ICE candidate to the other peer
                ws.send(JSON.stringify({
                    type: 'ice_candidate',
                    channelName: channelName,
                    candidate: event.candidate,
                    sender: userId,
                    recipient: partnerId
                }));
            }
        };

        // Handle connection state changes
        peerConnectionRef.current.onconnectionstatechange = () => {
            console.log('Connection state:', peerConnectionRef.current?.connectionState);
            if (peerConnectionRef.current?.connectionState === 'connected') {
                setConnectionStatus('connected');
            } else if (peerConnectionRef.current?.connectionState === 'failed' ||
                peerConnectionRef.current?.connectionState === 'disconnected' ||
                peerConnectionRef.current?.connectionState === 'closed') {
                setConnectionStatus('failed');
                setShowReconnectDialog(true);
            }
        };

        // Handle ICE connection state changes
        peerConnectionRef.current.oniceconnectionstatechange = () => {
            console.log('ICE connection state:', peerConnectionRef.current?.iceConnectionState);
            if (peerConnectionRef.current?.iceConnectionState === 'connected' ||
                peerConnectionRef.current?.iceConnectionState === 'completed') {
                setConnectionStatus('connected');
            }
        };

        // Handle remote tracks
        peerConnectionRef.current.ontrack = (event) => {
            console.log('Remote track received:', event.track.kind);
            if (remoteVideoRef.current && event.streams[0]) {
                remoteVideoRef.current.srcObject = event.streams[0];
                setConnectionStatus('connected'); // Also update status when we receive media
            }
        };
    };

    const joinChannel = () => {
        // Notify server we're joining this channel
        ws.send(JSON.stringify({
            type: 'join',
            channelName: channelName,
            userId: userId
        }));
    };

    const createOffer = async () => {
        if (!peerConnectionRef.current) return;

        try {
            const offer = await peerConnectionRef.current.createOffer();
            await peerConnectionRef.current.setLocalDescription(offer);

            // Send offer to the other peer
            ws.send(JSON.stringify({
                type: 'send_offer',
                channelName: channelName,
                offer: offer,
                sender: userId,
                recipient: partnerId
            }));
        } catch (error) {
            console.error('Error creating offer:', error);
            setConnectionStatus('failed');
        }
    };

    const handleReceivedOffer = async (data: any) => {
        if (!peerConnectionRef.current) return;
        console.log('Received offer from peer');

        try {
            await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.offer));
            const answer = await peerConnectionRef.current.createAnswer();
            await peerConnectionRef.current.setLocalDescription(answer);

            // Send answer to the offerer
            ws.send(JSON.stringify({
                type: 'send_answer',
                channelName: channelName,
                answer: answer,
                sender: userId,
                recipient: partnerId
            }));

            console.log('Answer sent to peer');

            // Process any pending ICE candidates now that remote description is set
            if (pendingIceCandidates.length > 0) {
                console.log(`Processing ${pendingIceCandidates.length} pending ICE candidates after setting remote description`);

                for (const candidate of pendingIceCandidates) {
                    try {
                        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
                    } catch (error) {
                        console.error('Error adding stored ICE candidate:', error);
                    }
                }

                setPendingIceCandidates([]);
            }
        } catch (error) {
            console.error('Error handling offer:', error);
            setConnectionStatus('failed');
        }
    };

    const handleReceivedAnswer = async (data: any) => {
        if (!peerConnectionRef.current) return;
        console.log('Received answer from peer');

        try {
            await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
            console.log('Remote description set successfully');

            // Process any pending ICE candidates now that remote description is set
            if (pendingIceCandidates.length > 0) {
                console.log(`Processing ${pendingIceCandidates.length} pending ICE candidates after setting remote description`);

                for (const candidate of pendingIceCandidates) {
                    try {
                        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
                    } catch (error) {
                        console.error('Error adding stored ICE candidate:', error);
                    }
                }

                setPendingIceCandidates([]);
            }

            // If we've received an answer, we should be getting connected soon
            // But in case the ICE connection state or ontrack doesn't trigger,
            // we'll update the status after a short delay if tracks have been received
            setTimeout(() => {
                if (remoteVideoRef.current?.srcObject && connectionStatus === 'connecting') {
                    console.log('Forcing connection status update after receiving answer');
                    setConnectionStatus('connected');
                }
            }, 3000);
        } catch (error) {
            console.error('Error handling answer:', error);
            setConnectionStatus('failed');
        }
    };

    const handleIceCandidate = async (data: any) => {
        if (!peerConnectionRef.current || !data.candidate || data.recipient !== userId) return;

        try {
            // Check if we have a remote description set
            if (peerConnectionRef.current.remoteDescription &&
                peerConnectionRef.current.remoteDescription.type) {
                // We can add the candidate immediately
                await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
                console.log('ICE candidate added successfully');
            } else {
                // Store the candidate to add later when remote description is set
                console.log('Storing ICE candidate for later');
                setPendingIceCandidates(prev => [...prev, data.candidate]);
            }
        } catch (error) {
            console.error('Error adding ICE candidate:', error);
        }
    };

    // Process any pending ICE candidates when remote description is set
    useEffect(() => {
        const processPendingCandidates = async () => {
            if (!peerConnectionRef.current ||
                !peerConnectionRef.current.remoteDescription ||
                pendingIceCandidates.length === 0) return;

            console.log(`Processing ${pendingIceCandidates.length} pending ICE candidates`);

            for (const candidate of pendingIceCandidates) {
                try {
                    await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
                } catch (error) {
                    console.error('Error adding stored ICE candidate:', error);
                }
            }

            // Clear the pending candidates after processing
            setPendingIceCandidates([]);
        };

        processPendingCandidates();
    }, [pendingIceCandidates, peerConnectionRef.current?.remoteDescription]);

    const handlePeerDisconnected = () => {
        // The other peer has disconnected
        setConnectionStatus('failed');
        setShowReconnectDialog(true);
    };

    const attemptReconnect = () => {
        setShowReconnectDialog(false);
        setConnectionStatus('connecting');

        // Close existing peer connection
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
        }

        // Re-setup connection
        const setupNewConnection = async () => {
            try {
                // Fetch ICE server configuration with TURN credentials
                const configuration = await fetchTurnServerCredentials();

                const peerConnection = new RTCPeerConnection(configuration);
                peerConnectionRef.current = peerConnection;

                // Add local tracks to the RTCPeerConnection
                if (localStreamRef.current) {
                    const stream = localStreamRef.current;
                    stream.getTracks().forEach(track => {
                        if (peerConnectionRef.current) {
                            peerConnectionRef.current.addTrack(track, stream);
                        }
                    });
                }

                // Set up event handlers for the peer connection
                setupPeerConnectionEvents();

                // Join the channel and start signaling
                joinChannel();

                // Start call as offerer (always when reconnecting)
                createOffer();
            } catch (error) {
                console.error('Error reconnecting:', error);
                setConnectionStatus('failed');
                setShowReconnectDialog(true);
            }
        };

        setupNewConnection();
    };

    const toggleMute = () => {
        if (localStreamRef.current) {
            const audioTracks = localStreamRef.current.getAudioTracks();
            audioTracks.forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsMuted(!isMuted);
        }
    };

    const toggleVideo = () => {
        if (localStreamRef.current) {
            const videoTracks = localStreamRef.current.getVideoTracks();
            videoTracks.forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsVideoOff(!isVideoOff);
        }
    };

    const endCall = () => {
        // Notify the server that we're ending the call
        ws.send(JSON.stringify({
            type: 'end_call',
            channelName: channelName,
            userId: userId
        }));

        // Close local stream and peer connection
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
        }

        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
        }

        // Clear timer
        if (timerInterval) {
            clearInterval(timerInterval);
        }

        // Trigger callback to parent component
        onConsultationEnd();
    };

    // Format call duration as MM:SS
    const formatCallDuration = () => {
        const minutes = Math.floor(callDuration / 60);
        const seconds = callDuration % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    // Check if remote stream exists
    const remoteStream = remoteVideoRef.current?.srcObject !== null;
    const localStream = localVideoRef.current?.srcObject !== null;
    const isConnected = connectionStatus === 'connected';
    const connectionState = isConnected ? "Connected" : "Disconnected";

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper
                sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: 'background.default',
                    minHeight: '80vh',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h5" component="h1">
                        {role === 'vet' ? 'Consultation with Pet Owner' : 'Consultation with Veterinarian'}
                    </Typography>
                    <Typography variant="body2" color={isConnected ? 'success.main' : 'error.main'}>
                        {connectionState} • {formatCallDuration()}
                    </Typography>
                </Box>

                <Grid2 container spacing={2} sx={{ flexGrow: 1 }}>
                    {/* Remote video (larger) */}
                    <Grid2 size={{xs:12, md:8}}>
                        <Paper
                            sx={{
                                width: '100%',
                                height: '100%',
                                minHeight: '400px',
                                backgroundColor: 'black',
                                position: 'relative',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <video
                                ref={remoteVideoRef}
                                autoPlay
                                playsInline
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            />

                            {!remoteStream && (
                                <Typography
                                    variant="body1"
                                    sx={{
                                        position: 'absolute',
                                        color: 'white',
                                        textAlign: 'center'
                                    }}
                                >
                                    Waiting for {role === 'vet' ? 'pet owner' : 'veterinarian'} to connect...
                                </Typography>
                            )}
                        </Paper>
                    </Grid2>

                    {/* Local video (smaller) */}
                    <Grid2 size={{xs:12, md:4}} >
                        <Stack spacing={2} sx={{ height: '100%' }}>
                            <Paper
                                sx={{
                                    width: '100%',
                                    flexGrow: 1,
                                    backgroundColor: 'black',
                                    position: 'relative'
                                }}
                            >
                                <video
                                    ref={localVideoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        transform: 'scaleX(-1)' // Mirror effect
                                    }}
                                />

                                {!localStream && (
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            color: 'white'
                                        }}
                                    >
                                        Camera not available
                                    </Typography>
                                )}

                                <Typography
                                    variant="body2"
                                    sx={{
                                        position: 'absolute',
                                        bottom: 8,
                                        left: 8,
                                        color: 'white',
                                        backgroundColor: 'rgba(0,0,0,0.5)',
                                        padding: '2px 6px',
                                        borderRadius: 1
                                    }}
                                >
                                    You
                                </Typography>
                            </Paper>

                            <Card sx={{ p: 2 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Consultation Info
                                </Typography>
                                <Typography variant="body2">
                                    Role: {role === 'vet' ? 'Veterinarian' : 'Pet Owner'}
                                </Typography>
                                <Typography variant="body2">
                                    Partner ID: {partnerId}
                                </Typography>
                                <Typography variant="body2">
                                    Channel: {channelName}
                                </Typography>
                            </Card>
                        </Stack>
                    </Grid2>
                </Grid2>

                {/* Control buttons */}
                <Stack
                    direction="row"
                    spacing={2}
                    justifyContent="center"
                    sx={{ mt: 3, mb: 1 }}
                >
                    <IconButton
                        onClick={toggleMute}
                        sx={{
                            backgroundColor: isMuted ? 'error.main' : 'primary.main',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: isMuted ? 'error.dark' : 'primary.dark',
                            }
                        }}
                    >
                        {isMuted ? <MicOff /> : <Mic />}
                    </IconButton>

                    <IconButton
                        onClick={toggleVideo}
                        sx={{
                            backgroundColor: isVideoOff ? 'error.main' : 'primary.main',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: isVideoOff ? 'error.dark' : 'primary.dark',
                            }
                        }}
                    >
                        {isVideoOff ? <VideocamOff /> : <Videocam />}
                    </IconButton>

                    <IconButton
                        onClick={endCall}
                        sx={{
                            backgroundColor: 'error.main',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: 'error.dark',
                            }
                        }}
                    >
                        <CallEnd />
                    </IconButton>
                </Stack>
            </Paper>

            {/* Reconnection Dialog */}
            <Dialog open={showReconnectDialog} onClose={() => setShowReconnectDialog(false)}>
                <DialogTitle>Connection Lost</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        The connection to your partner has been lost. Would you like to attempt to reconnect?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={endCall} color="error">End Consultation</Button>
                    <Button onClick={attemptReconnect} variant="contained" autoFocus>
                        Reconnect
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}