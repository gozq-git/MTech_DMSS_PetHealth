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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NtfySender = void 0;
const config_1 = require("../../config/config");
const axios_1 = __importDefault(require("axios"));
class NtfySender {
    constructor() {
        this.ntfyUrl = config_1.config.ntfy_url;
        this.ntfyTopic = 'PHP';
    }
    send(to, subject, body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = {
                    topic: `${this.ntfyTopic}_${to.split('@')[0]}`,
                    message: body.replace(/<br>/g, '\n'),
                    title: subject,
                };
                yield axios_1.default.post(this.ntfyUrl, payload, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                console.log(`Message sent to topic "${this.ntfyTopic}_${to}" successfully.`);
            }
            catch (error) {
                console.error(`Failed to send message to topic "${this.ntfyTopic}_${to}":`, error);
                throw error;
            }
        });
    }
}
exports.NtfySender = NtfySender;
