import {Container} from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import {useRef, useState, useEffect} from 'react';
import {Button, Typography, Input} from '@mui/material';

const URL_WEB_SOCKET = 'ws://localhost:8090/ws';
let localStream: MediaStream;
let localPeerConnection: RTCPeerConnection;
let sendChannel: RTCDataChannel;
let receiveChannel: RTCDataChannel;

const servers: RTCConfiguration = {'iceServers': []};

const TeleconsultationPage = () => {

    const [joinButtonDisabled, setJoinButtonDisabled] = useState<boolean>(true);
    const [callButtonDisabled, setCallButtonDisabled] = useState<boolean>(true);
    const [hangupButtonDisabled, setHangupButtonDisabled] = useState<boolean>(true);
    const [sendButtonDisabled, setSendButtonDisabled] = useState<boolean>(true);
    const [sendMessage, setSendMessage] = useState<string>('');
    const [receiveMessage, setReceiveMessage] = useState<string>('');
    const [channelName, setChannelName] = useState<string>('');
    const [userId, setUserId] = useState<string>(String(Math.floor(Math.random() * 1000000)));
    const [renderLocalStream]= useState<boolean>(false);
    const ws = useRef<WebSocket>(new WebSocket(URL_WEB_SOCKET));

    useEffect(() => {
        const wsClient = new WebSocket(URL_WEB_SOCKET);
        ws.current = wsClient;

        wsClient.onopen = () => {
            console.log('ws opened');
            setJoinButtonDisabled(false)
        };

        wsClient.onclose = () => console.log('ws closed');

        return () => {
            wsClient.close();
        };
    }, []);

    useEffect(() => {
        ws.current.onmessage = (message: MessageEvent) => {
            console.log('ws message received', message.data);
            const parsedMessage = JSON.parse(message.data);
            switch (parsedMessage.type) {
            case 'joined': {
                const body = parsedMessage.body;
                console.log('users in this channel', body);
                break;
            }
            case 'offer_sdp_received': {
                const offer = parsedMessage.body;
                onAnswer(offer);
                break;
            }
            case 'answer_sdp_received': {
                gotRemoteDescription(parsedMessage.body);
                break;
            }
            case 'quit': {
                break;
            }
            default:
                break;
            }
        };
    }, [channelName, userId]);

    const sendWsMessage = (type:string, body:any) => {
        console.log('sendWsMessage invoked', type, body);
        ws.current.send(JSON.stringify({
            type,
            body,
        }));
    };

    const start = () => {
        console.log('start invoked');

        navigator.mediaDevices.getUserMedia({audio: true, video: true}).then((stream: MediaStream) => {
            console.log('getUserMedia invoked', stream);
            // render local stream on DOM
            if (renderLocalStream) {
                const localPlayer = document.getElementById('localPlayer') as HTMLVideoElement;
                if (localPlayer) {
                    localPlayer.srcObject = stream;
                }
            }
            localStream = stream;
        }).catch((error) => {
            console.error('getUserMedia error:', error);
        });
    };

    const join = () => {
        start();

        console.log('join invoked');

        if (!channelName) {
            console.error('channelName is empty');
            alert('channelName is empty');
            return;
        }

        if (!userId) {
            console.error('userId is empty');
            alert('userId is empty');
            return;
        }

        setJoinButtonDisabled(true);
        setCallButtonDisabled(false);

        sendWsMessage('join', {
            channelName,
            userId,
        });
    };

    const callOnClick = () => {

        console.log('callOnClick invoked');

        setCallButtonDisabled(true);
        setHangupButtonDisabled(false);

        if (localStream.getVideoTracks().length > 0) {
            console.log(`Using video device: ${localStream.getVideoTracks()[0].label}`);
        }
        if (localStream.getAudioTracks().length > 0) {
            console.log(`Using audio device: ${localStream.getAudioTracks()[0].label}`);
        }

        console.log('new RTCPeerConnection for local');
        localPeerConnection = new RTCPeerConnection(servers);
        console.log('setup gotLocalIceCandidateOffer');
        localPeerConnection.onicecandidate = gotLocalIceCandidateOffer;

        console.log('setup gotRemoteStream');
        localPeerConnection.ontrack = gotRemoteStream;

        // create data channel before exchange sdp
        createDataChannel();

        console.log('localPeerConnection.addTrack invoked');
        localStream.getTracks().forEach((track) => {
            localPeerConnection.addTrack(track, localStream);
          });
        console.log('localPeerConnection.createOffer invoked');
        localPeerConnection.createOffer().then(gotLocalDescription);
    };

    const hangupOnClick = () => {
        console.log('hangupOnClick invoked');
        closeDataChannel();
        localPeerConnection.close();
        localPeerConnection = new RTCPeerConnection();
        setHangupButtonDisabled(true);
        setCallButtonDisabled(false);
    };

    const sendOnClick = () => {
        console.log('sendOnClick invoked', sendMessage);
        sendChannel.send(sendMessage);
        setSendMessage('');
    };

    const onAnswer = (offer: RTCSessionDescriptionInit) => {
        console.log('onAnswer invoked');
        setCallButtonDisabled(true);
        setHangupButtonDisabled(false);

        if (localStream.getVideoTracks().length > 0) {
            console.log(`Using video device: ${localStream.getVideoTracks()[0].label}`);
        }
        if (localStream.getAudioTracks().length > 0) {
            console.log(`Using audio device: ${localStream.getAudioTracks()[0].label}`);
        }

        console.log('new RTCPeerConnection for local');
        localPeerConnection = new RTCPeerConnection(servers);
        console.log('setup gotLocalIceCandidateAnswer');
        localPeerConnection.onicecandidate = gotLocalIceCandidateAnswer;

        console.log('setup gotRemoteStream');
        localPeerConnection.ontrack = gotRemoteStream;

        createDataChannel();

        console.log('localPeerConnection.addTrack invoked');
        localStream.getTracks().forEach((track) => {
            localPeerConnection.addTrack(track, localStream);
          });
        localPeerConnection.setRemoteDescription(offer);
        localPeerConnection.createAnswer().then(gotAnswerDescription);
    };

    const createDataChannel = () => {
        try {
            console.log('localPeerConnection.createDataChannel invoked');
            sendChannel = localPeerConnection.createDataChannel('sendDataChannel');
        } catch (error) {
            console.error('localPeerConnection.createDataChannel failed', error);
        }

        console.log('setup handleSendChannelStateChange');
        sendChannel.onopen = handleSendChannelStateChange;
        sendChannel.onclose = handleSendChannelStateChange;

        console.log('setup localPeerConnection.ondatachannel');
        localPeerConnection.ondatachannel = gotReceiveChannel;
    };

    const closeDataChannel = () => {
        console.log('closeDataChannel invoked');
        sendChannel && sendChannel.close();
        receiveChannel && receiveChannel.close();
        setSendButtonDisabled(true);
    };

    const gotLocalDescription = (offer: RTCSessionDescriptionInit) => {
        console.log('gotLocalDescription invoked:', offer);
        localPeerConnection.setLocalDescription(offer);
    };

    const gotAnswerDescription = (answer: RTCSessionDescriptionInit) => {
        console.log('gotAnswerDescription invoked:', answer);
        localPeerConnection.setLocalDescription(answer);
    };

    const gotRemoteDescription = (answer: RTCSessionDescriptionInit) => {
        console.log('gotRemoteDescription invoked:', answer);
        localPeerConnection.setRemoteDescription(answer);
    };

    const gotRemoteStream = (event: RTCTrackEvent) => {
        console.log('gotRemoteStream invoked');
        const remotePlayer = document.getElementById('peerPlayer');
        if (remotePlayer) {
            (remotePlayer as HTMLVideoElement).srcObject = event.streams[0];
        }
    };

    const gotLocalIceCandidateOffer = (event: RTCPeerConnectionIceEvent) => {
        console.log('gotLocalIceCandidateOffer invoked', event.candidate, localPeerConnection.localDescription);

        if (!channelName) {
            console.error('channelName is empty');
            alert('channelName is empty');
            return;
        }

        if (!userId) {
            console.error('userId is empty');
            alert('userId is empty');
            return;
        }

        // gathering candidate finished, send complete sdp
        if (!event.candidate) {
            const offer = localPeerConnection.localDescription;
            sendWsMessage('send_offer', {
                channelName,
                userId,
                sdp: offer,
            });
        }
    };

    const gotLocalIceCandidateAnswer = (event: RTCPeerConnectionIceEvent) => {
        console.log('gotLocalIceCandidateAnswer invoked', event.candidate, localPeerConnection.localDescription);

        if (!channelName) {
            console.error('channelName is empty');
            alert('channelName is empty');
            return;
        }

        if (!userId) {
            console.error('userId is empty');
            alert('userId is empty');
            return;
        }

        // gathering candidate finished, send complete sdp
        if (!event.candidate) {
            const answer = localPeerConnection.localDescription;
            sendWsMessage('send_answer', {
                channelName,
                userId,
                sdp: answer,
            });
        }
    };

    const gotReceiveChannel = (event: RTCDataChannelEvent) => {
        console.log('gotReceiveChannel invoked');
        receiveChannel = event.channel;
        receiveChannel.onmessage = handleMessage;
        receiveChannel.onopen = handleReceiveChannelStateChange;
        receiveChannel.onclose = handleReceiveChannelStateChange;
    };

    const handleMessage = (event: MessageEvent) => {
        console.log('handleMessage invoked', event.data);
        setReceiveMessage(event.data);
        setSendMessage('');
    };

    const handleSendChannelStateChange = () => {
        const readyState = sendChannel.readyState;
        console.log('handleSendChannelStateChange invoked', readyState);
        if (readyState === 'open') {
            setSendButtonDisabled(false);
        } else {
            setSendButtonDisabled(true);
        }
    };

    const handleReceiveChannelStateChange = () => {
        const readyState = receiveChannel.readyState;
        console.log('handleReceiveChannelStateChange invoked', readyState);
    };

    const renderHelper = () => {
        return (
            <Container 
                style={{display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'}}>
                <Input
                    placeholder="User ID"
                    style={{width: 240, marginTop: 16}}
                    value={userId}
                    onChange={(event) => {
                        setUserId(event.target.value);
                    }}
                />
                <Input
                    placeholder="Channel Name"
                    style={{width: 240, marginTop: 16}}
                    value={channelName}
                    onChange={(event) => {
                        setChannelName(event.target.value);
                    }}
                />
                <Button
                    onClick={join}
                    style={{width: 240, marginTop: 16}}
                    type="button"
                    disabled={joinButtonDisabled}
                >
                    Join
                </Button>
                <Button
                    onClick={callOnClick}
                    style={{width: 240, marginTop: 16}}
                    type="button"
                    disabled={callButtonDisabled}
                >
                    Call
                </Button>
                <Button
                    onClick={hangupOnClick}
                    style={{width: 240, marginTop: 16}}
                    type="button"
                    disabled={hangupButtonDisabled}
                >
                    Hangup
                </Button>
            </Container>
        );
    };

    const renderTextarea = () => {
        return (
            <Container
                style={{display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'top'}}>
                <Input
                    onChange={(e) => {
                        setSendMessage(e.target.value);
                    }}
                    style={{width: 240, marginTop: 16}}
                    value={sendMessage}
                    placeholder='Send message'
                />
                <Input
                    style={{width: 240, marginTop: 16}}
                    value={receiveMessage}
                    placeholder='Receive message'
                    disabled
                />
                <Button
                    onClick={sendOnClick}
                    style={{width: 240, marginTop: 16}}
                    type="button"
                    disabled={sendButtonDisabled}
                >
                    Send Message
                </Button>
            </Container>
        );
    };

    return (
        <Container>
            <Box>
                <Typography>WebRTC</Typography>
                <Typography sx={{whiteSpace: 'pre-line'}}>
                    {`@XY @SWATI: Incorporate workflow to generate "Meeting Id" (aka Channel Name). 
                    User ID is now randomly generated, but can replace with User actual id.
                    JOIN button: to join the meeting room (channel)
                    CALL button: to initiate the call
                    HANGUP button: to end the call
                    SEND MESSAGE button: to send message (while in call)
                    
                    To test: type in a random channel name string and click JOIN
                    Open a new incognito window and type in the same channel name string and click JOIN
                    Click CALL in one window`}
                </Typography>
                <Stack direction="row" style={{justifyContent: 'space-evenly', width: '50%'}}>
                    {renderHelper()}
                    {renderTextarea()}
                </Stack>
                <Box>
                    <video
                        id="peerPlayer"
                        autoPlay
                        style={{width: 640, height: 480}}
                    />
{/*                     <video
                        id="localPlayer"
                        autoPlay
                        style={{width: 640, height: 480}}
                    /> */}
                </Box>
            </Box>
        </Container>
    );

}

export default TeleconsultationPage;