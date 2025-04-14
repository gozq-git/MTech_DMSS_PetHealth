class EmailTemplate {
  protected subject: string = '';
  protected header: string = '';
  protected body: string = '';
  protected footer: string = '';
  protected recipient: string = '';

  constructor({subject, header, body, footer, recipient}: {subject: any; header: any; body: any; footer: any; recipient: any}) {
    // Initialize any default values if needed
    this.setRecipient(recipient);
    this.setSubject(subject);
    this.setHeader(header);
    this.setBody(body);
    this.setFooter(footer);
  }

  setSubject(subject: string): this {
    this.subject = `[PHP] ${subject}`;
    return this;
  }

  setHeader(header: string): this {
    this.header = header;
    return this;
  }

  setBody(body: string): this {
    this.body = body;
    return this;
  }

  setFooter(footer: string): this {
    this.footer = footer;
    return this;
  }

  setRecipient(recipient: string): this {
    this.recipient = recipient;
    return this;
  }

  build(): {subject: string; body: string} {
    return {
      subject: this.subject,
      body: `${this.header}<br><br>${this.body}<br><br>${this.footer}`,
    };
  }
}

export default EmailTemplate;
