import { NtfySender } from "../sender/ntfy_sender";
import { NotificationDecorator } from "./notification_decorator";

export class NtfyNotification extends NotificationDecorator  {
  
  private ntfySender: NtfySender | null = null;

  public async initSender(): Promise<NtfySender> {
    this.ntfySender = new NtfySender();
    return this.ntfySender;
  }

  public async sendNotification(): Promise<void> {
    if (!this.ntfySender) {
      this.ntfySender = await this.initSender();
    }
    try {
      await this.ntfySender.send(this.to, this.subject, this.body);
      console.log('Notification sent successfully');
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

}
