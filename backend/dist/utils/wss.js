"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const debug_1 = __importDefault(require("debug"));
let channels = {};
function init(port) {
    console.log('ws init invoked, port:', port);
    const wss = new ws_1.Server({ port });
    wss.on('connection', (socket) => {
        console.log('A client has connected!');
        socket.on('error', debug_1.default);
        socket.on('message', (message) => onMessage(wss, socket, message));
        socket.on('close', (message) => onClose(wss, socket, message));
    });
}
function send(wsClient, type, body) {
    console.log('ws send', body);
    wsClient.send(JSON.stringify({
        type,
        body,
    }));
}
function clearClient(wss, socket) {
    // clear all client
    // channels = {}
    Object.keys(channels).forEach((cname) => {
        Object.keys(channels[cname]).forEach((uid) => {
            if (channels[cname][uid] === socket) {
                delete channels[cname][uid];
            }
        });
    });
}
const dangerousKeys = ['__proto__', 'constructor', 'prototype'];
function isSafeKey(key) {
    return typeof key === 'string' && !dangerousKeys.includes(key);
}
function onMessage(wss, socket, message) {
    console.log(`onMessage ${message}`);
    const parsedMessage = JSON.parse(message);
    const type = parsedMessage.type;
    const body = parsedMessage.body;
    const channelName = body.channelName;
    const userId = body.userId;
    switch (type) {
        case 'join': {
            if (!channels.hasOwnProperty(channelName)) {
                if (!channels[channelName].hasOwnProperty(userId)) {
                    break;
                }
            }
            // join channel
            if (channels[channelName]) {
                channels[channelName][userId] = socket;
            }
            else {
                channels[channelName] = Object.create(null);
                channels[channelName][userId] = socket;
            }
            const userIds = Object.keys(channels[channelName]);
            send(socket, 'joined', userIds);
            break;
        }
        case 'quit': {
            // quit channel
            if (channels[channelName]) {
                delete channels[channelName][userId];
                const userIds = Object.keys(channels[channelName]);
                if (userIds.length === 0) {
                    delete channels[channelName];
                }
            }
            break;
        }
        case 'send_offer': {
            // exchange sdp to peer 
            const sdp = body.sdp;
            let userIds = Object.keys(channels[channelName]);
            userIds.forEach(id => {
                if (userId.toString() !== id.toString()) {
                    const wsClient = channels[channelName][id];
                    send(wsClient, 'offer_sdp_received', sdp);
                }
            });
            break;
        }
        case 'send_answer': {
            // exchange sdp to peer 
            const sdp = body.sdp;
            let userIds = Object.keys(channels[channelName]);
            userIds.forEach(id => {
                if (userId.toString() !== id.toString()) {
                    const wsClient = channels[channelName][id];
                    send(wsClient, 'answer_sdp_received', sdp);
                }
            });
            break;
        }
        case 'send_ice_candidate': {
            const candidate = body.candidate;
            let userIds = Object.keys(channels[channelName]);
            userIds.forEach(id => {
                if (userId.toString() !== id.toString()) {
                    const wsClient = channels[channelName][id];
                    send(wsClient, 'ice_candidate_received', candidate);
                }
            });
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
function onClose(wss, socket, message) {
    console.log('onClose', message);
    clearClient(wss, socket);
}
module.exports = {
    init,
};
