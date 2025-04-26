"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationDecorator = void 0;
// This file defines an abstract class for sending notifications.
class NotificationDecorator {
    constructor(notification) {
        this.to = notification.to;
        this.subject = notification.subject;
        this.body = notification.body;
    }
}
exports.NotificationDecorator = NotificationDecorator;
