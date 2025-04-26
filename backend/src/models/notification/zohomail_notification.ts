import { ZohoMailSender } from "../sender/zohomail_sender";
import { EmailNotification } from "./email_notification";

export class ZohomailNotification extends EmailNotification  {
  
  public async initSender(): Promise<Sender> {
    const emailSender = new ZohoMailSender();
    return emailSender;
  }

}
