/**
 * Manages active consultations between vets and pet owners
 */
export class ConsultationManager {
    constructor(connectionManager) {
        this.connectionManager = connectionManager;
        this.activeConsultations = new Map();
    }

    /**
     * Start a new consultation between a vet and pet owner
     * @param {VetObserver} vet - The vet observer
     * @param {PetOwnerObserver} petOwner - The pet owner observer
     */
    startConsultation(vet, petOwner) {
        // Create a unique channel name for this consultation
        const channelName = `consult-${Date.now()}`;

        // Set channel name for both participants
        vet.setChannelName(channelName);
        petOwner.setChannelName(channelName);

        // Add to active consultations
        this.activeConsultations.set(channelName, {
            vetId: vet.id,
            petOwnerId: petOwner.id,
            started: new Date()
        });

        // Notify both participants
        vet.sendMessage({
            type: 'consultation_starting',
            channelName,
            petOwnerId: petOwner.id
        });

        petOwner.sendMessage({
            type: 'consultation_starting',
            channelName,
            vetId: vet.id
        });
    }

    /**
     * End a consultation when a participant disconnects
     * @param {Observer} participant - The participant who disconnected
     */
    endConsultation(participant) {
        // Find the other participant and notify them
        const channelName = participant.channelName;

        if (channelName) {
            // Forward disconnection message to all participants in the channel
            this.broadcastToChannel({
                type: 'peer_disconnected',
                channelName: channelName,
                userId: participant.id
            }, channelName, null);

            // Remove from active consultations
            this.activeConsultations.delete(channelName);
        }
    }

    /**
     * Forward WebRTC signaling messages to the appropriate channel
     * @param {Object} message - The message to forward
     * @param {WebSocket} sender - The sender's WebSocket connection
     */
    forwardSignalingMessage(message, sender) {
        const channelName = message.channelName;

        if (channelName) {
            console.log(`Forwarding ${message.type} to channel ${channelName}`);
            this.broadcastToChannel(message, channelName, sender);
        }
    }

    /**
     * Broadcast a message to all participants in a channel except the sender
     * @param {Object} message - The message to broadcast
     * @param {string} channelName - The channel to broadcast to
     * @param {WebSocket} sender - The sender's WebSocket connection to exclude
     */
    broadcastToChannel(message, channelName, sender) {
        console.log(`Broadcasting to channel ${channelName}:`, message.type);
        let recipients = 0;

        this.connectionManager.getAllConnections().forEach((observer, ws) => {
            if (ws !== sender && observer.channelName === channelName) {
                observer.sendMessage(message);
                recipients++;
            }
        });

        console.log(`Message sent to ${recipients} recipients`);
    }

    /**
     * Get the number of active consultations
     * @returns {number} - Number of active consultations
     */
    getActiveConsultationsCount() {
        return this.activeConsultations.size;
    }
}