import { config } from "../../config/config";
import axios from 'axios';

export class NtfySender implements Sender {
    private ntfyUrl: string = config.ntfy_url;
    private ntfyTopic: string;

    constructor() {
        this.ntfyTopic = 'PHP';
    }

    async send(to: string, subject: string, body: string): Promise<void> {
        try {
            const payload = {
                topic: `${this.ntfyTopic}_${to.split('@')[0]}`,
                message: body.replace(/<br>/g, '\n'),
                title: subject,
            };

            await axios.post(this.ntfyUrl, payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log(`Message sent to topic "${this.ntfyTopic}_${to}" successfully.`);
        } catch (error) {
            console.error(`Failed to send message to topic "${this.ntfyTopic}_${to}":`, error);
            throw error;
        }
    }
}