"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailNotification = void 0;
class EmailNotification {
    constructor(to, subject, body) {
        this.emailSender = null;
        this.to = to;
        this.subject = subject;
        this.body = body;
    }
    sendNotification() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sendEmail();
        });
    }
    sendEmail() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.emailSender) {
                this.emailSender = yield this.initSender();
            }
            try {
                yield this.emailSender.send(this.to, this.subject, this.body);
                console.log('Email sent successfully');
            }
            catch (error) {
                console.error('Error sending email:', error);
                throw error;
            }
        });
    }
}
exports.EmailNotification = EmailNotification;
