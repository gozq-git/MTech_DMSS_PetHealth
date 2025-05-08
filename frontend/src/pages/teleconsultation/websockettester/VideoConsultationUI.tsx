import React, {useContext, useEffect, useRef, useState} from 'react';
import {
    Box,
    Button,
    Card,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid2,
    IconButton,
    Paper,
    Stack,
    Typography
} from '@mui/material';

import {CallEnd, Mic, MicOff, ScreenShare, StopScreenShare, Videocam, VideocamOff} from "@mui/icons-material";
import {SNACKBAR_SEVERITY, SnackbarContext} from "../../../providers/SnackbarProvider.tsx";

// ICE Server configuration - using public STUN servers
const publicIceServers = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' }
    ]
};

interface VideoConsultationProps {
    userId : string;
    role: string;
    partnerId: string;
    channelName: string;
    ws: WebSocket
    onConsultationEnd: () => void;
}

/**
 * WebRTC Video Consultation Component
 */
export const VideoConsultationUI:React.FC<VideoConsultationProps> = ({
                                                                         userId,
                                                                         role,
                                                                         partnerId,
                                                                         channelName,
                                                                         ws,
                                                                         onConsultationEnd
                                                                     }) => {
    // References to video elements
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);

    // WebRTC state
    const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [isMuted, setIsMuted] = useState<boolean>(false);
    const [isVideoOff, setIsVideoOff] = useState<boolean>(false);
    const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);
    const [connectionState, setConnectionState] = useState<string>('new');
    // const [error, setError] = useState<string>("");
    const {showSnackbar} = useContext(SnackbarContext);
    // Track the original stream when screen sharing
    const [originalStream, setOriginalStream] = useState<MediaStream | null>(null);
    // Connection dialog state
    const [showReconnectDialog, setShowReconnectDialog] = useState(false);

    const meteredTurnServerApiKey = import.meta.env.VITE_METERED_API_KEY || `107d1251f774c45fe3bdd4a363fe758c3463`;
    console.log(`meteredTurnServerApiKey = ${import.meta.env.VITE_METERED_API_KEY}`)

    useEffect(() => {
        // Initialize WebRTC connection with Metered TURN servers
        const initializePeerConnection = async () => {
            try {
                // Initialize with empty config first
                const peerConfiguration: RTCConfiguration = {};

                // Fetch TURN credentials from Metered
                const response = await fetch(
                    `https://xeyndev.metered.live/api/v1/turn/credentials?apiKey=${meteredTurnServerApiKey}`
                );

                if (response.ok) {
                    peerConfiguration.iceServers = await response.json();
                    console.log("TURN servers loaded successfully");
                } else {
                    console.error("Failed to fetch TURN servers, falling back to defaults");
                    // Fallback to public STUN servers if Metered request fails
                    peerConfiguration.iceServers = publicIceServers.iceServers
                }

                // Create the peer connection with the configuration
                const newPeerConnection = new RTCPeerConnection(peerConfiguration);

                // Add logging for debugging
                newPeerConnection.addEventListener('signalingstatechange', () => {
                    console.log(`Signaling state changed: ${newPeerConnection.signalingState}`);
                });

                newPeerConnection.addEventListener('iceconnectionstatechange', () => {
                    console.log(`ICE connection state: ${newPeerConnection.iceConnectionState}`);
                });

                // Set up other event handlers...

                setPeerConnection(newPeerConnection);
            } catch (error) {
                console.error("Error initializing peer connection:", error);
            }
        };

        initializePeerConnection();

        // Clean up function
        return () => {
            if (peerConnection) {
                peerConnection.close();
            }
        };
    }, []);
    // Initialize WebRTC connection
    useEffect(() => {
        if (!channelName || !ws || ws.readyState !== WebSocket.OPEN) {
            return;
        }

        // Join the channel
        ws.send(JSON.stringify({
            type: 'join',
            channelName: channelName,
            userId: userId
        }));

        // Set up WebRTC connection
        initializeWebRTC();

        // Cleanup function
        return () => {
            cleanupWebRTC();
        };
    }, [channelName, ws]);

    // Handle WebSocket messages for WebRTC signaling
    useEffect(() => {
        if (!ws) return;

        const handleMessage = (event: MessageEvent) => {
            let data;
            try {
                data = JSON.parse(event.data);
            } catch (err) {
                console.error('Error parsing WebSocket message:', err);
                return;
            }

            // Only process messages for our channel
            if (data.channelName !== channelName) {
                return;
            }

            console.log('Received message:', data.type);

            switch (data.type) {
                case 'send_offer':
                    // Only process offers when we're in a state that can accept them
                    if (peerConnection &&
                        (peerConnection.signalingState === 'stable' || peerConnection.signalingState === 'closed')) {
                        console.log('Processing incoming offer');
                        handleIncomingOffer(data.offer);
                    } else {
                        console.warn('Received offer in invalid state:', peerConnection?.signalingState);
                    }
                    break;

                case 'send_answer':
                    // Only process answers when we're in have-local-offer state
                    if (peerConnection && peerConnection.signalingState === 'have-local-offer') {
                        console.log('Processing incoming answer');
                        handleIncomingAnswer(data.answer);
                    } else {
                        console.warn('Received answer in invalid state:', peerConnection?.signalingState);
                        // If we receive an answer in the wrong state, we might need to reconnect
                        if (peerConnection && peerConnection.signalingState === 'stable') {
                            // We might be in a situation where both peers are trying to be the offerer
                            // If we're the vet, we should be the one creating offers
                            if (role === 'vet') {
                                console.log('Vet is reinitializing connection');
                                setTimeout(() => {
                                    if (peerConnection && peerConnection.signalingState === 'stable') {
                                        createAndSendOffer(peerConnection);
                                    }
                                }, 1000);
                            }
                        }
                    }
                    break;

                case 'ice_candidate':
                    if (peerConnection) {
                        console.log('Processing ICE candidate');
                        handleIncomingICECandidate(data.candidate);
                    }
                    break;

                case 'peer_disconnected':
                    showSnackbar('Your partner has disconnected.', SNACKBAR_SEVERITY.INFO);
                    // You might want to end the consultation or implement reconnection logic
                    break;

                default:
                    console.warn('Unknown message type:', data.type);
            }
        };

        // Add message event listener
        ws.addEventListener('message', handleMessage);

        // Cleanup
        return () => {
            ws.removeEventListener('message', handleMessage);
        };
    }, [ws, channelName, peerConnection, role]);

    // Update video elements when streams change
    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }

        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [localStream, remoteStream]);

    // Handle connection state changes
    useEffect(() => {
        if (connectionState === 'connected') {
            setIsConnected(true);
            setShowReconnectDialog(false);
        } else if (connectionState === 'disconnected' || connectionState === 'failed') {
            setIsConnected(false);
            setShowReconnectDialog(true);
        }
    }, [connectionState]);

    // Initialize WebRTC connection and get user media
    const initializeWebRTC = async () => {
        try {
            // Get user media (camera and microphone)
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });

            setLocalStream(stream);

            // Create RTCPeerConnection
            const peerConnection = new RTCPeerConnection(publicIceServers);

            // Add tracks to the peer connection
            stream.getTracks().forEach(track => {
                peerConnection.addTrack(track, stream);
            });

            // Set up event handlers for the peer connection
            setupPeerConnectionEventHandlers(peerConnection);

            setPeerConnection(peerConnection);

            // If we're the vet, we'll initiate the call
            if (role === 'vet') {
                setTimeout(() => createAndSendOffer(peerConnection), 1000);
            }
        } catch (e) {
            console.error('Error initializing WebRTC:', e);
            // setError(`Could not access camera or microphone: ${(e as Error).message}`);
            showSnackbar(`Could not access camera or microphone: ${(e as Error).message}`, SNACKBAR_SEVERITY.ERROR);
        }
    };

    const logConnectionState = () => {
        if (!peerConnection) return;

        console.log('Connection States:', {
            signalingState: peerConnection.signalingState,
            connectionState: peerConnection.connectionState,
            iceConnectionState: peerConnection.iceConnectionState,
            iceGatheringState: peerConnection.iceGatheringState
        });
    };

    // Set up event handlers for the peer connection
    const setupPeerConnectionEventHandlers = (peerConnection: RTCPeerConnection) => {
        // Handle ICE candidates
        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                console.log('ICE candidate:', event.candidate);
                sendICECandidate(event.candidate);
            }
        };

        // Handle connection state changes
        peerConnection.onconnectionstatechange = () => {
            setConnectionState(peerConnection.connectionState);
            console.log('Connection state changed:', peerConnection.connectionState);
            logConnectionState();
        };

        // Handle ICE connection state changes
        peerConnection.oniceconnectionstatechange = () => {
            console.log('ICE connection state:', peerConnection.iceConnectionState);
            logConnectionState();
        };

        // Add signaling state change handler
        peerConnection.onsignalingstatechange = () => {
            console.log('Signaling state changed:', peerConnection.signalingState);
            logConnectionState();
        };

        // Handle remote track event
        peerConnection.ontrack = (event) => {
            console.log('Track event:', event);
            setRemoteStream(event.streams[0]);
        };
    };

    // Create and send WebRTC offer
    const createAndSendOffer = async (peerConnection: RTCPeerConnection) => {
        try {
            const offer = await peerConnection.createOffer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true
            });

            await peerConnection.setLocalDescription(offer);

            // Send the offer to the other peer
            ws.send(JSON.stringify({
                type: 'send_offer',
                channelName: channelName,
                offer: peerConnection.localDescription
            }));
        } catch (err) {
            console.error('Error creating offer:', err);
            // setError(`Failed to create offer: ${(err as Error).message}`);
            showSnackbar(`Failed to create offer: ${(err as Error).message}`,SNACKBAR_SEVERITY.ERROR);
        }
    };

    // Handle incoming WebRTC offer
    const handleIncomingOffer = async (offer: RTCSessionDescriptionInit) => {
        if (!peerConnection) return;

        try {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);

            // Send the answer to the other peer
            ws.send(JSON.stringify({
                type: 'send_answer',
                channelName: channelName,
                answer: peerConnection.localDescription
            }));
        } catch (err) {
            console.error('Error handling offer:', err);
            // setError(`Failed to handle offer: ${(err as Error).message}`);
            showSnackbar(`Failed to handle offer: ${(err as Error).message}`,SNACKBAR_SEVERITY.ERROR);
        }
    };

    // Handle incoming WebRTC answer
    const handleIncomingAnswer = async (answer: RTCSessionDescriptionInit) => {
        if (!peerConnection) return;

        try {
            // Check if the connection is in the correct state to receive an answer
            if (peerConnection.signalingState === 'have-local-offer') {
                await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
            } else {
                console.warn('Received answer while in wrong signaling state:', peerConnection.signalingState);
                // You may want to implement reconnection logic here or notify the user
            }
        } catch (err: any) {
            console.error('Error handling answer:', err);
            showSnackbar(`Failed to handle answer: ${(err as Error).message}`, SNACKBAR_SEVERITY.ERROR);
        }
    };

    // Send ICE candidate to the other peer
    const sendICECandidate = (candidate: RTCIceCandidateInit) => {
        ws.send(JSON.stringify({
            type: 'ice_candidate',
            channelName: channelName,
            candidate: candidate
        }));
    };

    // Handle incoming ICE candidate
    const handleIncomingICECandidate = async (candidate: RTCIceCandidateInit) => {
        if (!peerConnection) return;

        try {
            await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
            console.error('Error adding ICE candidate:', err);
        }
    };

    // Toggle mute
    const toggleMute = () => {
        if (localStream) {
            const audioTracks = localStream.getAudioTracks();
            audioTracks.forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsMuted(!isMuted);
        }
    };

    // Toggle video
    const toggleVideo = () => {
        if (localStream) {
            const videoTracks = localStream.getVideoTracks();
            videoTracks.forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsVideoOff(!isVideoOff);
        }
    };

    // Toggle screen sharing
    const toggleScreenSharing = async () => {
        if (isScreenSharing) {
            // Switch back to camera
            if (originalStream) {
                // Replace the current track with the original camera track
                const screenTrack = localStream?.getVideoTracks()[0];
                const cameraTrack = originalStream.getVideoTracks()[0];

                if (screenTrack && cameraTrack) {
                    const sender = peerConnection?.getSenders().find(s =>
                        s.track && s.track.kind === 'video'
                    );

                    if (sender) {
                        sender.replaceTrack(cameraTrack);
                    }

                    screenTrack.stop();

                    // Update local video
                    setLocalStream(originalStream);
                    setOriginalStream(null);
                }
            }
        } else {
            // Switch to screen sharing
            try {
                const screenStream = await navigator.mediaDevices.getDisplayMedia({
                    video: true
                });

                // Save original stream for when we switch back
                setOriginalStream(localStream);

                // Replace the camera track with the screen track
                const cameraTrack = localStream?.getVideoTracks()[0];
                const screenTrack = screenStream.getVideoTracks()[0];

                // Add listener for when user stops screen sharing
                screenTrack.onended = () => {
                    toggleScreenSharing();
                };

                if (cameraTrack && screenTrack) {
                    const sender = peerConnection?.getSenders().find(s =>
                        s.track && s.track.kind === 'video'
                    );

                    if (sender) {
                        sender.replaceTrack(screenTrack);
                    }

                    // Create a new stream with the screen video and original audio
                    const newStream = new MediaStream();
                    newStream.addTrack(screenTrack);

                    // Add all audio tracks from the original stream
                    localStream?.getAudioTracks().forEach(track => {
                        newStream.addTrack(track);
                    });

                    // Update local video
                    setLocalStream(newStream);
                }
            } catch (err) {
                console.error('Error starting screen sharing:', err);
                // setError(`Failed to start screen sharing: ${(err as Error).message}`);
                showSnackbar(`Failed to start screen sharing: ${(err as Error).message}`,SNACKBAR_SEVERITY.ERROR);
                return;
            }
        }

        setIsScreenSharing(!isScreenSharing);
    };

    // End consultation and clean up
    const endConsultation = () => {
        cleanupWebRTC();

        if (onConsultationEnd) {
            onConsultationEnd();
        }
    };

    // Attempt to reconnect after connection failure
    const attemptReconnect = () => {
        cleanupWebRTC();
        initializeWebRTC();
        setShowReconnectDialog(false);
    };

    // Clean up WebRTC resources
    const cleanupWebRTC = () => {
        // Stop all tracks
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
        }

        if (originalStream) {
            originalStream.getTracks().forEach(track => track.stop());
        }

        // Close peer connection
        if (peerConnection) {
            peerConnection.close();
        }

        // Clear state
        setLocalStream(null);
        setRemoteStream(null);
        setPeerConnection(null);
        setOriginalStream(null);
    };

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
                        {isConnected ? 'Connected' : 'Disconnected'} • {connectionState}
                    </Typography>
                </Box>

                {/*{error && (*/}
                {/*    <Alert severity="error" sx={{ mb: 2 }}>*/}
                {/*        {error}*/}
                {/*    </Alert>*/}
                {/*)}*/}

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
                    <Grid2 size={{xs:12, md:4}}>
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
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
                                    You{isScreenSharing ? ' (Screen)' : ''}
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
                        {isVideoOff ? <Videocam /> : <VideocamOff />}
                    </IconButton>

                    <IconButton
                        onClick={toggleScreenSharing}
                        sx={{
                            backgroundColor: isScreenSharing ? 'success.main' : 'primary.main',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: isScreenSharing ? 'success.dark' : 'primary.dark',
                            }
                        }}
                    >
                        {isScreenSharing ? <StopScreenShare /> : <ScreenShare />}
                    </IconButton>

                    <IconButton
                        onClick={endConsultation}
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
                    <Button onClick={endConsultation} color="error">End Consultation</Button>
                    <Button onClick={attemptReconnect} variant="contained" autoFocus>
                        Reconnect
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};