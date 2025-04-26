// This file defines an abstract class for sending notifications.
interface PhPNotification {
  
  to: string;
  subject: string;
  body: string;

  sendNotification(): Promise<void>;
  
  initSender(): Promise<Sender>;

}
