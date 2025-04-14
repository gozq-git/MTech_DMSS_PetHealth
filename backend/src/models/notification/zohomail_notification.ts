import { ZohoMailSender } from "../email_sender/zohomail_sender";
import { EmailNotification } from "./email_notification";

export class ZohomailNotification extends EmailNotification  {
  
  public async initEmailNotificationSender(): Promise<EmailSender> {
    const emailSender = new ZohoMailSender();
    return emailSender;
  }

}
