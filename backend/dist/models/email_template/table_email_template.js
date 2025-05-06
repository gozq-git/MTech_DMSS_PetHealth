"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const email_template_1 = __importDefault(require("./email_template"));
class TableEmailTemplate extends email_template_1.default {
    setBody(body) {
        // Convert the JSON object into an HTML table
        const tableRows = Object.entries(body)
            .map(([key, value]) => `<tr><td><strong>${key}</strong></td><td>${value}</td></tr>\n`)
            .join('');
        this.body = `
      <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
        ${tableRows}
      </table>
    `;
        return this;
    }
}
exports.default = TableEmailTemplate;
