import WebSocket, { Server as WebSocketServer, WebSocket as WebSocketClient } from 'ws';
import debug from 'debug';
let channels: { [channelName: string]: { [userId: string]: WebSocketClient } } = {}

function init (port: number): void {
    console.log('ws init invoked, port:', port)

    const wss = new WebSocketServer({ port });
    wss.on('connection', (socket: WebSocketClient) => {
        console.log('A client has connected!');
        
        socket.on('error', debug);
        socket.on('message', (message: string) => onMessage(wss, socket, message));
        socket.on('close', (message: string) => onClose(wss, socket, message));
    })
}

function send(wsClient: WebSocketClient, type: string, body: any): void {
    console.log('ws send', body);
    wsClient.send(JSON.stringify({
        type,
        body,
    }))
}

function clearClient(wss: WebSocketServer, socket: WebSocketClient): void {
    // clear all client
    // channels = {}
    Object.keys(channels).forEach((cname) => {
        Object.keys(channels[cname]).forEach((uid) => {
            if (channels[cname][uid] === socket) {
                delete channels[cname][uid]
            }
        })
    })
}

function onMessage(wss: WebSocketServer, socket: WebSocketClient, message: string): void {
    console.log(`onMessage ${message}`);

    const parsedMessage = JSON.parse(message)
    const type = parsedMessage.type
    const body = parsedMessage.body
    const channelName = body.channelName
    const userId = body.userId
    
    switch (type) {
        case 'join': {
            // join channel
            if (channels[channelName]) {
                channels[channelName][userId] = socket
            } else {
                channels[channelName] = {}
                channels[channelName][userId] = socket
            }
            const userIds = Object.keys(channels[channelName])
            send(socket, 'joined', userIds)
            break;
        }
        case 'quit': {
            // quit channel
            if (channels[channelName]) {
                delete channels[channelName][userId];
                const userIds = Object.keys(channels[channelName])
                if (userIds.length === 0) {
                    delete channels[channelName]
                }
            }
            break;
        }
        case 'send_offer': { 
            // exchange sdp to peer 
            const sdp = body.sdp
            let userIds = Object.keys(channels[channelName])
            userIds.forEach(id => {
                if (userId.toString() !== id.toString()) {
                    const wsClient = channels[channelName][id]
                    send(wsClient, 'offer_sdp_received', sdp)
                }
            })
            break;
        }
        case 'send_answer': { 
            // exchange sdp to peer 
            const sdp = body.sdp
            let userIds = Object.keys(channels[channelName])
            userIds.forEach(id => {
                if (userId.toString() !== id.toString()) {
                    const wsClient = channels[channelName][id]
                    send(wsClient, 'answer_sdp_received', sdp)
                }
            })
            break;
        }
        case 'send_ice_candidate': {
            const candidate = body.candidate
            let userIds = Object.keys(channels[channelName])
            userIds.forEach(id => {
                if (userId.toString() !== id.toString()) {
                    const wsClient = channels[channelName][id]
                    send(wsClient, 'ice_candidate_received', candidate)
                }
            })
        }
        default:
            break;
    }

    // // Send message back to all clients connected
    // wss.clients.forEach(client => {
    //     if (client !== socket && client.readyState === WebSocket.OPEN) {
    //         client.send(message, { binary: isBinary });
    //     }
    // });
}

function onClose(wss: WebSocketServer, socket: WebSocketClient, message: string): void {
    console.log('onClose', message);
    clearClient(wss, socket)
}

module.exports = {
    init,
}