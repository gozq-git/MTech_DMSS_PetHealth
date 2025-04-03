// websocket-server/src/index.js
import WebSocket, { WebSocketServer } from 'ws';
import express from 'express';
import cors from 'cors';
import http from "http";

const app = express()
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Store for active connections and waiting room state
const connections = new Map();
const waitingRoom = {
    petOwners: [],
    vets: []
};

// Map to track active consultations by channelName
const activeConsultations = new Map();

wss.on('connection', (ws) => {
    console.log('New client connected');

    // Handle messages from clients
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message.toString());
            console.log('Received:', data);

            switch (data.type) {
                case 'register':
                    // Register user with role and ID
                    connections.set(ws, {
                        id: data.userId,
                        role: data.role, // 'pet-owner' or 'vet'
                        channelName: null // Initialize with no channel
                    });

                    // Add to appropriate waiting list
                    if (data.role === 'pet-owner') {
                        waitingRoom.petOwners.push({
                            id: data.userId,
                            joinTime: new Date(),
                            ws: ws,
                            petInfo: data.petInfo || {},
                            reason: data.reason || 'No reason provided'
                        });

                        // Send confirmation to pet owner
                        ws.send(JSON.stringify({
                            type: 'waiting_room_joined',
                            position: waitingRoom.petOwners.length,
                            estimatedWaitMinutes: waitingRoom.petOwners.length * 10 // Simple estimation
                        }));

                        // Notify all vets of waiting pet owner
                        broadcastToVets({
                            type: 'waiting_list_update',
                            waitingPetOwners: waitingRoom.petOwners.map(owner => ({
                                id: owner.id,
                                waitingSince: owner.joinTime,
                                petInfo: owner.petInfo,
                                reason: owner.reason
                            }))
                        });
                    } else if (data.role === 'vet') {
                        waitingRoom.vets.push({
                            id: data.userId,
                            ws: ws
                        });

                        // Send current waiting list to new vet
                        ws.send(JSON.stringify({
                            type: 'waiting_list_update',
                            waitingPetOwners: waitingRoom.petOwners.map(owner => ({
                                id: owner.id,
                                waitingSince: owner.joinTime,
                                petInfo: owner.petInfo,
                                reason: owner.reason
                            }))
                        }));
                    }
                    break;

                case 'accept_consultation':
                    // Vet accepting a consultation with pet owner
                    const petOwner = waitingRoom.petOwners.find(owner => owner.id === data.petOwnerId);
                    const vetInfo = connections.get(ws);

                    if (petOwner && vetInfo) {
                        // Remove from waiting room
                        waitingRoom.petOwners = waitingRoom.petOwners.filter(owner => owner.id !== data.petOwnerId);

                        // Create a channel for them
                        const channelName = `consult-${Date.now()}`;

                        // Update channelName for both participants
                        connections.set(ws, {
                            ...vetInfo,
                            channelName: channelName
                        });

                        connections.set(petOwner.ws, {
                            ...connections.get(petOwner.ws),
                            channelName: channelName
                        });

                        // Track the consultation
                        activeConsultations.set(channelName, {
                            vetId: vetInfo.id,
                            petOwnerId: data.petOwnerId,
                            started: new Date()
                        });

                        // Notify both parties
                        petOwner.ws.send(JSON.stringify({
                            type: 'consultation_starting',
                            channelName,
                            vetId: vetInfo.id
                        }));

                        ws.send(JSON.stringify({
                            type: 'consultation_starting',
                            channelName,
                            petOwnerId: data.petOwnerId
                        }));

                        // Update all vets with new waiting list
                        broadcastToVets({
                            type: 'waiting_list_update',
                            waitingPetOwners: waitingRoom.petOwners.map(owner => ({
                                id: owner.id,
                                waitingSince: owner.joinTime,
                                petInfo: owner.petInfo,
                                reason: owner.reason
                            }))
                        });
                    }
                    break;

                case 'join':
                    // Update the user's channel when they join
                    const joinUserInfo = connections.get(ws);
                    if (joinUserInfo) {
                        connections.set(ws, {
                            ...joinUserInfo,
                            channelName: data.channelName
                        });

                        console.log(`User ${joinUserInfo.id} joined channel ${data.channelName}`);
                    }
                    break;

                // Handle WebRTC signaling messages
                case 'send_offer':
                case 'send_answer':
                case 'ice_candidate':
                    // Forward to appropriate recipients based on channelName
                    broadcastToChannel(data, data.channelName, ws);
                    break;
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    });

    // Handle disconnection
    ws.on('close', () => {
        const userInfo = connections.get(ws);
        if (userInfo) {
            if (userInfo.role === 'pet-owner') {
                waitingRoom.petOwners = waitingRoom.petOwners.filter(owner => owner.id !== userInfo.id);
            } else if (userInfo.role === 'vet') {
                waitingRoom.vets = waitingRoom.vets.filter(vet => vet.id !== userInfo.id);
            }

            // Notify consultation partner if in active consultation
            if (userInfo.channelName) {
                broadcastToChannel({
                    type: 'peer_disconnected',
                    channelName: userInfo.channelName,
                    userId: userInfo.id
                }, userInfo.channelName, null);

                // Clean up consultation if needed
                activeConsultations.delete(userInfo.channelName);
            }

            connections.delete(ws);

            // Notify others if needed
            if (userInfo.role === 'pet-owner') {
                broadcastToVets({
                    type: 'waiting_list_update',
                    waitingPetOwners: waitingRoom.petOwners.map(owner => ({
                        id: owner.id,
                        waitingSince: owner.joinTime,
                        petInfo: owner.petInfo,
                        reason: owner.reason
                    }))
                });
            }
        }
        console.log('Client disconnected');
    });
});

// Helper function to broadcast to all vets
function broadcastToVets(message) {
    waitingRoom.vets.forEach(vet => {
        vet.ws.send(JSON.stringify(message));
    });
}

// Helper function to broadcast to specific channel
function broadcastToChannel(message, channelName, sender) {
    console.log(`Broadcasting to channel ${channelName}:`, message.type);
    let recipients = 0;

    connections.forEach((userInfo, connection) => {
        if (connection !== sender && userInfo.channelName === channelName) {
            connection.send(JSON.stringify(message));
            recipients++;
        }
    });

    console.log(`Message sent to ${recipients} recipients`);
}

// Health check endpoint
app.get('/status', (req, res) => {
    res.status(200).json({
        status: 'ok',
        waitingPetOwners: waitingRoom.petOwners.length,
        activeVets: waitingRoom.vets.length,
        activeConsultations: activeConsultations.size
    });
});

// Start server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`WebSocket server running on port ${PORT}`);
});