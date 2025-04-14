export abstract class EmailNotification  {

  private emailSender: EmailSender | null = null;

  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    if (!this.emailSender) {
      this.emailSender = await this.initEmailNotificationSender();
    }
    try {
      await this.emailSender.sendEmail(to, subject, body);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
  
  abstract initEmailNotificationSender(): Promise<EmailSender>;

}
