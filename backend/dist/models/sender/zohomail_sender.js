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
exports.ZohoMailSender = void 0;
const config_1 = require("../../config/config");
const axios_1 = __importDefault(require("axios"));
/**
 * Class implementing the Sender interface for Zoho Mail
*/
class ZohoMailSender {
    constructor(cachedToken = null, tokenExpiryTime = null) {
        this.cachedToken = null;
        this.tokenExpiryTime = null;
        // Initialize the cached token and expiry time
        this.cachedToken = cachedToken;
        this.tokenExpiryTime = tokenExpiryTime;
        this.getZohoMailToken(); // Fetch the token on initialization
        console.log('ZohoMailSender initialized and token fetched.');
    }
    /**
    * Function to retrieve a Zoho Mail token, with caching for 50 minutes
    * @param clientId - The client ID of your Zoho application
    * @param clientSecret - The client secret of your Zoho application
    * @param refreshToken - The refresh token obtained during the initial authorization
    * @returns A promise resolving to the access token
    */
    getZohoMailToken() {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTime = Date.now() + 0;
            // Check if the token is cached and still valid
            if (this.cachedToken && this.tokenExpiryTime && currentTime < this.tokenExpiryTime) {
                console.log('Returning cached token.');
                return this.cachedToken;
            }
            console.log('Fetching a new token from Zoho.');
            const url = 'https://accounts.zoho.com/oauth/v2/token';
            try {
                const response = yield axios_1.default.post(url, new URLSearchParams({
                    client_id: config_1.config.zoho_client_id,
                    client_secret: config_1.config.zoho_client_secret,
                    refresh_token: config_1.config.zoho_refresh_token,
                    grant_type: 'refresh_token',
                    scope: 'ZohoMail.messages.ALL',
                }), {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                });
                if (response.status === 200) {
                    this.cachedToken = response.data.access_token;
                    this.tokenExpiryTime = currentTime + 50 * 60 * 1000; // Cache for 50 minutes
                    console.log('New token retrieved and cached.');
                    console.log('Token:', this.cachedToken);
                    return this.cachedToken;
                }
                else {
                    throw new Error(`Failed to retrieve token: ${response.data}`);
                }
            }
            catch (error) {
                console.error('Error while retrieving token:', error);
                throw error;
            }
        });
    }
    /**
     * Sends an email using the Zoho Mail API.
     * @param to - The recipient's email address.
     * @param subject - The subject of the email.
     * @param body - The body content of the email.
     */
    send(to, subject, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield this.getZohoMailToken(); // Retrieve the token using the existing function
            const url = `https://mail.zoho.com/api/accounts/${config_1.config.zoho_account_id}/messages`;
            try {
                const response = yield axios_1.default.post(url, {
                    fromAddress: config_1.config.zoho_email,
                    toAddress: to,
                    subject: subject,
                    content: body,
                }, {
                    headers: {
                        'Authorization': `Zoho-oauthtoken ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.status === 200) {
                    console.log('Email sent successfully:', response.data);
                }
                else {
                    console.error('Failed to send email:', response.data);
                    throw new Error(`Failed to send email: ${response.data}`);
                }
            }
            catch (error) {
                console.error('Error while sending email:', error);
                throw error;
            }
        });
    }
}
exports.ZohoMailSender = ZohoMailSender;
