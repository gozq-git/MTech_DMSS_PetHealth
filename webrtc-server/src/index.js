import {WebSocketServer} from 'ws';
import express from 'express';
import cors from 'cors';
import https from "http.js";
import {ConnectionManager} from './ConnectionManager.js';
import {WaitingRoomSubject} from './WaitingRoomSubject.js';
import {VetObserver} from './VetObserver.js';
import {PetOwnerObserver} from './PetOwnerObserver.js';
import {ConsultationManager} from './ConsultationManager.js';

// Initialize the Express app and WebSocket server
const app = express();
app.disable('x-powered-by');
app.use(cors());

const server = https.createServer(app);
const wss = new WebSocketServer({ server });

// system components using observer pattern
const connectionManager = new ConnectionManager();
const waitingRoomSubject = new WaitingRoomSubject();
const consultationManager = new ConsultationManager(connectionManager);

// Handle new WebSocket connections
wss.on('connection', (ws) => {
    console.log('New client connected');

    // Handle messages from clients
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message.toString());
            console.log('Received:', data);

            switch (data.type) {
                case 'register':
                    // Register user with their role
                    if (data.role === 'pet-owner') {
                        const petOwner = new PetOwnerObserver(
                            ws,
                            data.userId,
                            data.petInfo || {},
                            data.reason || 'No reason provided'
                        );
                        connectionManager.addConnection(ws, petOwner);
                        waitingRoomSubject.addPetOwner(petOwner);
                    } else if (data.role === 'vet') {
                        const vet = new VetObserver(ws, data.userId);
                        connectionManager.addConnection(ws, vet);
                        waitingRoomSubject.addVet(vet);

                        // Subscribe vet to waiting room updates
                        waitingRoomSubject.registerObserver(vet);

                        // Send initial waiting list to new vet
                        vet.update(waitingRoomSubject.getWaitingPetOwners());
                    }
                    break;

                case 'accept_consultation':
                    // Vet accepting a consultation with pet owner
                    const vet = connectionManager.getConnectionInfo(ws);
                    if (vet && vet.role === 'vet') {
                        const petOwner = waitingRoomSubject.getPetOwnerById(data.petOwnerId);

                        if (petOwner) {
                            // Start a consultation between the vet and pet owner
                            consultationManager.startConsultation(vet, petOwner);

                            // Remove pet owner from waiting room
                            waitingRoomSubject.removePetOwner(petOwner);
                        }
                    }
                    break;

                case 'join':
                    // Update the user's channel when they join a consultation
                    const user = connectionManager.getConnectionInfo(ws);
                    if (user) {
                        user.setChannelName(data.channelName);
                        console.log(`User ${user.id} joined channel ${data.channelName}`);
                    }
                    break;

                // Handle WebRTC signaling messages
                case 'send_offer':
                case 'send_answer':
                case 'ice_candidate':
                    consultationManager.forwardSignalingMessage(data, ws);
                    break;
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    });

    // Handle disconnection
    ws.on('close', () => {
        const user = connectionManager.getConnectionInfo(ws);

        if (user) {
            // Handle user disconnection based on their role
            if (user.role === 'pet-owner') {
                waitingRoomSubject.removePetOwner(user);
            } else if (user.role === 'vet') {
                waitingRoomSubject.removeVet(user);
                waitingRoomSubject.unregisterObserver(user);
            }

            // Handle active consultation disconnection
            if (user.channelName) {
                consultationManager.endConsultation(user);
            }

            // Remove the connection
            connectionManager.removeConnection(ws);
        }

        console.log('Client disconnected');
    });
});

// Health check endpoint
app.get('/status', (req, res) => {
    res.status(200).json({
        status: 'ok',
        waitingPetOwners: waitingRoomSubject.getPetOwnersCount(),
        activeVets: waitingRoomSubject.getVetsCount(),
        activeConsultations: consultationManager.getActiveConsultationsCount()
    });
});

// Start server
const PORT = 8080;
server.listen(PORT, () => {
    console.log(`WebSocket server running on port ${PORT}`);
});