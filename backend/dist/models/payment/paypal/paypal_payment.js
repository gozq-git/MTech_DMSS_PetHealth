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
exports.PayPalPayment = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../../../config/config");
class PayPalPayment {
    constructor() {
        this.accessToken = null;
        this.tokenExpiry = null;
        this.clientId = config_1.config.paypal_client_id;
        this.clientSecret = config_1.config.paypal_client_secret;
        this.baseUrl = "https://api-m.sandbox.paypal.com"; // Use sandbox for testing; switch to live for production
        this.getAccessToken();
    }
    /**
     * Generates an access token for PayPal API, caching it for 50 minutes.
     * @returns The access token.
     */
    getAccessToken() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if the token is still valid
                if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
                    return this.accessToken;
                }
                // Retrieve a new token
                const response = yield axios_1.default.post(`${this.baseUrl}/v1/oauth2/token`, "grant_type=client_credentials", {
                    auth: {
                        username: this.clientId,
                        password: this.clientSecret,
                    },
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                });
                // Cache the token and set its expiry time (50 minutes from now)
                this.accessToken = response.data.access_token;
                this.tokenExpiry = new Date(new Date().getTime() + 50 * 60 * 1000); // 50 minutes in milliseconds
                return this.accessToken;
            }
            catch (error) {
                console.error("Error generating PayPal access token:", error);
                throw error;
            }
        });
    }
    /**
     * Creates a payment order.
     * @param amount - The amount to charge.
     * @param currency - The currency code (e.g., 'USD').
     * @param description - The payment description.
     * @returns The order ID.
     */
    createOrder(amount, currency, description) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const accessToken = yield this.getAccessToken();
                const response = yield axios_1.default.post(`${this.baseUrl}/v2/checkout/orders`, {
                    intent: "CAPTURE",
                    purchase_units: [
                        {
                            amount: {
                                currency_code: currency,
                                value: amount.toFixed(2),
                            },
                            description,
                        },
                    ],
                }, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                });
                return response.data.id; // Return the order ID
            }
            catch (error) {
                console.error("Error creating PayPal order:", error);
                throw error;
            }
        });
    }
    /**
     * Captures a payment for an order.
     * @param orderId - The ID of the order to capture.
     * @returns Whether the capture was successful.
     */
    captureOrder(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const accessToken = yield this.getAccessToken();
                const response = yield axios_1.default.post(`${this.baseUrl}/v2/checkout/orders/${orderId}/capture`, {}, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                });
                return response.data.status === "COMPLETED";
            }
            catch (error) {
                console.error("Error capturing PayPal order:", error);
                throw error;
            }
        });
    }
    /**
     * Retrieves the status of an order.
     * @param orderId - The ID of the order to retrieve.
     * @returns The status of the order.
     */
    getOrderStatus(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const accessToken = yield this.getAccessToken();
                const response = yield axios_1.default.get(`${this.baseUrl}/v2/checkout/orders/${orderId}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                });
                return response.data.status; // Return the order status
            }
            catch (error) {
                console.error("Error retrieving PayPal order status:", error);
                throw error;
            }
        });
    }
}
exports.PayPalPayment = PayPalPayment;
