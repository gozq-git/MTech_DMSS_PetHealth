import { Observer } from './Observer.js';

/**
 * Concrete observer for vets
 * Vets receive notifications about waiting pet owners
 */
export class VetObserver extends Observer {
    constructor(ws, id) {
        super(ws, id, 'vet');
    }

    /**
     * Handle updates from the waiting room subject
     * @param {Array} waitingPetOwners - List of waiting pet owners
     */
    update(waitingPetOwners) {
        this.sendMessage({
            type: 'waiting_list_update',
            waitingPetOwners: waitingPetOwners
        });
    }
}
