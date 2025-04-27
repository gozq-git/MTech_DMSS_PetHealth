import axios from 'axios';
import { config } from "../../../config/config";

export class PayPalPayment {
    private clientId: string;
    private clientSecret: string;
    private baseUrl: string;
    private accessToken: string | null = null;
    private tokenExpiry: Date | null = null;

    constructor() {
        this.clientId = config.paypal_client_id;
        this.clientSecret = config.paypal_client_secret;
        this.baseUrl = "https://api-m.sandbox.paypal.com"; // Use sandbox for testing; switch to live for production
        this.getAccessToken();
    }

    /**
     * Generates an access token for PayPal API, caching it for 50 minutes.
     * @returns The access token.
     */
    private async getAccessToken(): Promise<string> {
        try {
            // Check if the token is still valid
            if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
                return this.accessToken;
            }

            // Retrieve a new token
            const response = await axios.post(
                `${this.baseUrl}/v1/oauth2/token`,
                "grant_type=client_credentials",
                {
                    auth: {
                        username: this.clientId,
                        password: this.clientSecret,
                    },
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            );

            // Cache the token and set its expiry time (50 minutes from now)
            this.accessToken = response.data.access_token;
            this.tokenExpiry = new Date(new Date().getTime() + 50 * 60 * 1000); // 50 minutes in milliseconds
            return this.accessToken as string;

        } catch (error) {
            console.error("Error generating PayPal access token:", error);
            throw error;
        }
    }

    /**
     * Creates a payment order.
     * @param amount - The amount to charge.
     * @param currency - The currency code (e.g., 'USD').
     * @param description - The payment description.
     * @returns The order ID.
     */
    async createOrder(amount: number, currency: string, description: string): Promise<string> {
        try {
            const accessToken = await this.getAccessToken();
            const response = await axios.post(
                `${this.baseUrl}/v2/checkout/orders`,
                {
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
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            return response.data.id; // Return the order ID
        } catch (error) {
            console.error("Error creating PayPal order:", error);
            throw error;
        }
    }

    /**
     * Captures a payment for an order.
     * @param orderId - The ID of the order to capture.
     * @returns Whether the capture was successful.
     */
    async captureOrder(orderId: string): Promise<boolean> {
        try {
            const accessToken = await this.getAccessToken();
            const response = await axios.post(
                `${this.baseUrl}/v2/checkout/orders/${orderId}/capture`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            return response.data.status === "COMPLETED";
        } catch (error) {
            console.error("Error capturing PayPal order:", error);
            throw error;
        }
    }

    /**
     * Retrieves the status of an order.
     * @param orderId - The ID of the order to retrieve.
     * @returns The status of the order.
     */
    async getOrderStatus(orderId: string): Promise<string> {
        try {
            const accessToken = await this.getAccessToken();
            const response = await axios.get(
                `${this.baseUrl}/v2/checkout/orders/${orderId}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            return response.data.status; // Return the order status
        } catch (error) {
            console.error("Error retrieving PayPal order status:", error);
            throw error;
        }
    }
}