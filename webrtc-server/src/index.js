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
    petOwners: [], // This will track pet owners by their appointmentId
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
                    // Register user with role, ID, and appointmentId
                    connections.set(ws, {
                        id: data.userId,
                        role: data.role, // 'pet-owner' or 'vet'
                        appointmentId: data.appointmentId, // Store the appointmentId
                        channelName: null // Initialize with no channel
                    });

                    if (data.role === 'pet-owner') {
                        // Add pet owner to waiting room with appointmentId
                        waitingRoom.petOwners.push({
                            id: data.userId,
                            appointmentId: data.appointmentId,
                            joinTime: new Date(),
                            ws: ws,
                            petInfo: data.petInfo || {},
                            reason: data.reason || 'No reason provided'
                        });

                        // Send confirmation to pet owner with their waiting position
                        const position = waitingRoom.petOwners.length;
                        ws.send(JSON.stringify({
                            type: 'waiting_room_joined',
                            position: position,
                            estimatedWaitMinutes: position * 10 // Simple wait time estimation
                        }));

                        // Notify all vets of the updated waiting list
                        broadcastToVets({
                            type: 'waiting_list_update',
                            waitingPetOwners: waitingRoom.petOwners.map(owner => ({
                                id: owner.id,
                                appointmentId: owner.appointmentId, // Include appointmentId
                                waitingSince: owner.joinTime,
                                petInfo: owner.petInfo,
                                reason: owner.reason
                            }))
                        });
                    } else if (data.role === 'vet') {
                        // Add vet to waiting room (no appointmentId here, just ID)
                        waitingRoom.vets.push({
                            id: data.userId,
                            ws: ws
                        });

                        // Send current waiting list to new vet
                        ws.send(JSON.stringify({
                            type: 'waiting_list_update',
                            waitingPetOwners: waitingRoom.petOwners.map(owner => ({
                                id: owner.id,
                                appointmentId: owner.appointmentId, // Include appointmentId
                                waitingSince: owner.joinTime,
                                petInfo: owner.petInfo,
                                reason: owner.reason
                            }))
                        }));
                    }
                    break;

                case 'accept_consultation':
                    // Vet accepting a consultation with a pet owner based on appointmentId
                    const petOwner = waitingRoom.petOwners.find(owner => owner.appointmentId === data.appointmentId);
                    const vetInfo = connections.get(ws);

                    if (petOwner && vetInfo) {
                        // Remove pet owner from the waiting room
                        waitingRoom.petOwners = waitingRoom.petOwners.filter(owner => owner.appointmentId !== data.appointmentId);

                        // Create a channel for the consultation
                        const channelName = `consult-${data.appointmentId}`;

                        // Update the channelName for both participants
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
                            petOwnerId: petOwner.id,
                            appointmentId: petOwner.appointmentId,
                            started: new Date()
                        });

                        // Notify both participants about the consultation starting
                        petOwner.ws.send(JSON.stringify({
                            type: 'consultation_starting',
                            channelName,
                            vetId: vetInfo.id
                        }));

                        ws.send(JSON.stringify({
                            type: 'consultation_starting',
                            channelName,
                            petOwnerId: petOwner.id
                        }));

                        // Update all vets with the new waiting list
                        broadcastToVets({
                            type: 'waiting_list_update',
                            waitingPetOwners: waitingRoom.petOwners.map(owner => ({
                                id: owner.id,
                                appointmentId: owner.appointmentId, // Include appointmentId
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
                    console.log('send_offer data', data);
                    broadcastToChannel(data, data.channelName, ws);
                    break;
                case 'send_answer':
                    console.log('send_answer data', data);
                    broadcastToChannel(data, data.channelName, ws);
                    break;
                case 'ice_candidate':
                    console.log('ice_candidate data', data)
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
                        appointmentId: owner.appointmentId, // Include appointmentId
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
