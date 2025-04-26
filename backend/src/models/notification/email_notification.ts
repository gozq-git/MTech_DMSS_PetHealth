export abstract class EmailNotification implements PhPNotification {

  public to: string;
  public subject: string;
  public body: string;

  constructor(to: string, subject: string, body: string) {
    this.to = to;
    this.subject = subject;
    this.body = body;
  }

  private emailSender: Sender | null = null;

  async sendNotification(): Promise<void> {
    await this.sendEmail();
  }

  async sendEmail(): Promise<void> {
    if (!this.emailSender) {
      this.emailSender = await this.initSender();
    }
    try {
      await this.emailSender.send(this.to, this.subject, this.body);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  abstract initSender(): Promise<Sender>;

}
