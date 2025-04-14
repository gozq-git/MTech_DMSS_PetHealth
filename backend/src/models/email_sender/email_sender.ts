/**
 * Interface for sending emails.
 * Provides methods to initialize the email sender and send emails.
 */
interface EmailSender {
  /**
   * Sends an email to the specified recipient.
   * @param to - The recipient's email address.
   * @param subject - The subject of the email.
   * @param body - The body content of the email.
   * @returns A promise that resolves when the email is sent.
   */
  sendEmail(to: string, subject: string, body: string): Promise<void>;

}