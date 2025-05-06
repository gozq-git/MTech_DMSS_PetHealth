// websocket-server/src/WaitingRoomSubject.js
import { Subject } from './Subject.js';

/**
 * Concrete subject for the waiting room
 * Manages the waiting list of pet owners and notifies vet observers
 */
export class WaitingRoomSubject extends Subject {
    constructor() {
        super();
        this.petOwners = [];
        this.vets = [];
    }

    /**
     * Add a pet owner to the waiting room
     * @param {PetOwnerObserver} petOwner - The pet owner to add
     */
    addPetOwner(petOwner) {
        this.petOwners.push(petOwner);

        // Notify the pet owner about their position
        petOwner.update(this.petOwners.length);

        // Notify all vet observers about the updated waiting list
        this.notifyObservers(this.getWaitingPetOwners());
    }

    /**
     * Remove a pet owner from the waiting room
     * @param {PetOwnerObserver} petOwner - The pet owner to remove
     */
    removePetOwner(petOwner) {
        this.petOwners = this.petOwners.filter(owner => owner.id !== petOwner.id);

        // Update positions for remaining pet owners
        this.petOwners.forEach((owner, index) => {
            owner.update(index + 1);
        });

        // Notify all vet observers about the updated waiting list
        this.notifyObservers(this.getWaitingPetOwners());
    }

    /**
     * Add a vet to the active vets list
     * @param {VetObserver} vet - The vet to add
     */
    addVet(vet) {
        this.vets.push(vet);
    }

    /**
     * Remove a vet from the active vets list
     * @param {VetObserver} vet - The vet to remove
     */
    removeVet(vet) {
        this.vets = this.vets.filter(v => v.id !== vet.id);
    }

    /**
     * Get a pet owner by their ID
     * @param {string} id - The pet owner ID
     * @returns {PetOwnerObserver|undefined} - The pet owner or undefined if not found
     */
    getPetOwnerById(id) {
        return this.petOwners.find(owner => owner.id === id);
    }

    /**
     * Get the list of waiting pet owners in a format suitable for sending to vets
     * @returns {Array} - List of waiting pet owner information
     */
    getWaitingPetOwners() {
        return this.petOwners.map(owner => owner.getWaitingInfo());
    }

    /**
     * Get the number of pet owners in the waiting room
     * @returns {number} - Number of waiting pet owners
     */
    getPetOwnersCount() {
        return this.petOwners.length;
    }

    /**
     * Get the number of active vets
     * @returns {number} - Number of active vets
     */
    getVetsCount() {
        return this.vets.length;
    }
}