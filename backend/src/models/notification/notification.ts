abstract class NotificationSender {
  
  abstract sendNotification(): Promise<void>;
  
  abstract initNotificationSender(): Promise<string>;

}
