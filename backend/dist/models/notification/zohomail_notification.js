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
exports.ZohomailNotification = void 0;
const zohomail_sender_1 = require("../sender/zohomail_sender");
const email_notification_1 = require("./email_notification");
class ZohomailNotification extends email_notification_1.EmailNotification {
    initSender() {
        return __awaiter(this, void 0, void 0, function* () {
            const emailSender = new zohomail_sender_1.ZohoMailSender();
            return emailSender;
        });
    }
}
exports.ZohomailNotification = ZohomailNotification;
