// websocket-server/src/Observer.js
/**
 * Observer interface for the Observer pattern
 * Observers receive updates from subjects they're registered with
 */
import {WebSocket} from 'ws'
export class Observer {
    constructor(ws, id, role) {
        this.ws = ws;
        this.id = id;
        this.role = role;
        this.channelName = null;
    }

    /**
     * Called when the subject has an update to notify observers about
     * @param {*} data - The data being sent to observers
     */
    update(data) {
        throw new Error('Method update() must be implemented by subclasses');
    }

    /**
     * Send a message to this observer's websocket
     * @param {*} message - The message to send
     */
    sendMessage(message) {
        console.debug(this.ws.readyState);
        console.debug(WebSocket.OPEN);
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        }
    }

    /**
     * Set the channel name for this observer
     * @param {string} channelName - The channel name
     */
    setChannelName(channelName) {
        this.channelName = channelName;
    }
}