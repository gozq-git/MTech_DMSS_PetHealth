import { Observer } from './Observer.js';

/**
 * Concrete observer for pet owners
 * Receives notifications about their waiting status
 */
export class PetOwnerObserver extends Observer {
    constructor(ws, id, petInfo, reason) {
        super(ws, id, 'pet-owner');
        this.petInfo = petInfo;
        this.reason = reason;
        this.joinTime = new Date();
    }

    /**
     * Handle updates from the waiting room subject
     * In this case, pet owners are notified about their position in the waiting room
     * @param {number} position - Position in the waiting queue
     */
    update(position) {
        this.sendMessage({
            type: 'waiting_room_joined',
            position: position,
            estimatedWaitMinutes: position * 10 // Simple estimation
        });
    }

    /**
     * Get information about this pet owner for displaying in the waiting list
     */
    getWaitingInfo() {
        return {
            id: this.id,
            waitingSince: this.joinTime,
            petInfo: this.petInfo,
            reason: this.reason
        };
    }
}