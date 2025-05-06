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
exports.NtfyNotification = void 0;
const ntfy_sender_1 = require("../sender/ntfy_sender");
const notification_decorator_1 = require("./notification_decorator");
class NtfyNotification extends notification_decorator_1.NotificationDecorator {
    constructor() {
        super(...arguments);
        this.ntfySender = null;
    }
    initSender() {
        return __awaiter(this, void 0, void 0, function* () {
            this.ntfySender = new ntfy_sender_1.NtfySender();
            return this.ntfySender;
        });
    }
    sendNotification() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.ntfySender) {
                this.ntfySender = yield this.initSender();
            }
            try {
                yield this.ntfySender.send(this.to, this.subject, this.body);
                console.log('Notification sent successfully');
            }
            catch (error) {
                console.error('Error sending notification:', error);
                throw error;
            }
        });
    }
}
exports.NtfyNotification = NtfyNotification;
