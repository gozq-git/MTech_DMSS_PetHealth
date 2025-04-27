"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EmailTemplate {
    constructor({ subject, header, body, footer, recipient }) {
        this.subject = '';
        this.header = '';
        this.body = '';
        this.footer = '';
        this.recipient = '';
        // Initialize any default values if needed
        this.setRecipient(recipient);
        this.setSubject(subject);
        this.setHeader(header);
        this.setBody(body);
        this.setFooter(footer);
    }
    setSubject(subject) {
        this.subject = `${subject}`;
        return this;
    }
    setHeader(header) {
        this.header = header;
        return this;
    }
    setBody(body) {
        this.body = body;
        return this;
    }
    setFooter(footer) {
        this.footer = footer;
        return this;
    }
    setRecipient(recipient) {
        this.recipient = recipient;
        return this;
    }
    build() {
        return {
            subject: this.subject,
            body: `${this.header}<br><br>${this.body}<br><br>${this.footer}`,
        };
    }
}
exports.default = EmailTemplate;
