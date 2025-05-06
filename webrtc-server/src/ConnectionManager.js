/**
 * Manages WebSocket connections and their associated observer objects
 */
export class ConnectionManager {
    constructor() {
        this.connections = new Map();
    }

    /**
     * Add a new connection
     * @param {WebSocket} ws - The WebSocket connection
     * @param {Observer} observer - The observer associated with this connection
     */
    addConnection(ws, observer) {
        this.connections.set(ws, observer);
    }

    /**
     * Remove a connection
     * @param {WebSocket} ws - The WebSocket connection to remove
     */
    removeConnection(ws) {
        this.connections.delete(ws);
    }

    /**
     * Get the observer object associated with a WebSocket connection
     * @param {WebSocket} ws - The WebSocket connection
     * @returns {Observer|undefined} - The observer or undefined if not found
     */
    getConnectionInfo(ws) {
        return this.connections.get(ws);
    }

    /**
     * Get all active connections
     * @returns {Map} - Map of WebSocket connections to their observer objects
     */
    getAllConnections() {
        return this.connections;
    }
}