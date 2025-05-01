// websocket-server/src/Subject.js
/**
 * Subject interface for the Observer pattern
 * Subjects maintain a list of observers and notify them of changes
 */
export class Subject {
    constructor() {
        this.observers = new Set();
    }

    /**
     * Register an observer to receive updates from this subject
     * @param {Observer} observer - The observer to register
     */
    registerObserver(observer) {
        this.observers.add(observer);
    }

    /**
     * Unregister an observer to stop receiving updates from this subject
     * @param {Observer} observer - The observer to unregister
     */
    unregisterObserver(observer) {
        this.observers.delete(observer);
    }

    /**
     * Notify all registered observers with the provided data
     * @param {*} data - The data to send to observers
     */
    notifyObservers(data) {
        this.observers.forEach(observer => {
            observer.update(data);
        });
    }
}