// This file defines an abstract class for sending notifications.
export abstract class NotificationDecorator implements PhPNotification {

  public to: string;
  public subject: string;
  public body: string;

  constructor(notification: PhPNotification) { 
    this.to = notification.to;
    this.subject = notification.subject;
    this.body = notification.body;
  }

  public abstract sendNotification(): Promise<void>;

  abstract initSender(): Promise<Sender>;
}
