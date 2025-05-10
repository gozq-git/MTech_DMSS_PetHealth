import { PayPalPayment } from "../../../../src/models/payment/paypal/paypal_payment";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("PayPalPayment", () => {
    let paypalPayment: PayPalPayment;

    beforeEach(() => {
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // describe("getAccessToken", () => {
    //     paypalPayment = new PayPalPayment();
    //     it("should return a cached access token if it is still valid", async () => {
    //         const mockToken = "mockAccessToken";
    //         const mockExpiry = new Date(new Date().getTime() + 10 * 60 * 1000); // 10 minutes from now
    //         (paypalPayment as any).accessToken = mockToken;
    //         (paypalPayment as any).tokenExpiry = mockExpiry;

    //         const token = await (paypalPayment as any).getAccessToken();

    //         expect(token).toBe(mockToken);
    //         expect(mockedAxios.post).not.toHaveBeenCalled();
    //     });

    //     it("should fetch a new access token if the cached one is expired", async () => {
    //         mockedAxios.post.mockResolvedValueOnce({
    //             data: { access_token: "newAccessToken" },
    //         });

    //         const token = await (paypalPayment as any).getAccessToken();

    //         expect(token).toBe("newAccessToken");
    //         expect(mockedAxios.post).toHaveBeenCalledWith(
    //             "https://api-m.sandbox.paypal.com/v1/oauth2/token",
    //             "grant_type=client_credentials",
    //             expect.objectContaining({
    //                 auth: {
    //                     username: expect.any(String),
    //                     password: expect.any(String),
    //                 },
    //             })
    //         );
    //     });

    //     it("should throw an error if the token request fails", async () => {
    //         mockedAxios.post.mockRejectedValueOnce(new Error("Request failed"));

    //         await expect((paypalPayment as any).getAccessToken()).rejects.toThrow("Request failed");
    //     });
    // });

    describe("createOrder", () => {
        PayPalPayment.prototype.getAccessToken = jest.fn(async x => {
            return 'mockAccessToken';
        });
        paypalPayment = new PayPalPayment();

        it("should create a PayPal order and return the order ID", async () => {
            mockedAxios.post.mockResolvedValueOnce({
                data: { id: "mockOrderId" },
            });


            const orderId = await paypalPayment.createOrder(100, "USD", "Test Payment");

            expect(orderId).toBe("mockOrderId");
            expect(mockedAxios.post).toHaveBeenCalledWith(
                "https://api-m.sandbox.paypal.com/v2/checkout/orders",
                expect.objectContaining({
                    intent: "CAPTURE",
                    purchase_units: [
                        {
                            amount: { currency_code: "USD", value: "100.00" },
                            description: "Test Payment",
                        },
                    ],
                }),
                expect.objectContaining({
                    headers: {
                        Authorization: "Bearer mockAccessToken",
                        "Content-Type": "application/json",
                    },
                })
            );
        });

        it("should throw an error if the order creation fails", async () => {
            mockedAxios.post.mockRejectedValueOnce(new Error("Order creation failed"));


            await expect(paypalPayment.createOrder(100, "USD", "Test Payment")).rejects.toThrow(
                "Order creation failed"
            );
        });
    });

    describe("captureOrder", () => {
        PayPalPayment.prototype.getAccessToken = jest.fn(async x => {
            return 'mockAccessToken';
        });
        paypalPayment = new PayPalPayment();

        it("should capture a PayPal order and return true if successful", async () => {
            mockedAxios.post.mockResolvedValueOnce({
                data: { status: "COMPLETED" },
            });


            const result = await paypalPayment.captureOrder("mockOrderId");

            expect(result).toBe(true);
            expect(mockedAxios.post).toHaveBeenCalledWith(
                "https://api-m.sandbox.paypal.com/v2/checkout/orders/mockOrderId/capture",
                {},
                expect.objectContaining({
                    headers: {
                        Authorization: "Bearer mockAccessToken",
                        "Content-Type": "application/json",
                    },
                })
            );
        });

        it("should throw an error if the capture fails", async () => {
            mockedAxios.post.mockRejectedValueOnce(new Error("Capture failed"));

            await expect(paypalPayment.captureOrder("mockOrderId")).rejects.toThrow("Capture failed");
        });
    });

    describe("getOrderStatus", () => {
        PayPalPayment.prototype.getAccessToken = jest.fn(async x => {
            return 'mockAccessToken';
        });
        paypalPayment = new PayPalPayment();

        it("should retrieve the status of a PayPal order", async () => {
            mockedAxios.get.mockResolvedValueOnce({
                data: { status: "COMPLETED" },
            });

            const status = await paypalPayment.getOrderStatus("mockOrderId");

            expect(status).toBe("COMPLETED");
            expect(mockedAxios.get).toHaveBeenCalledWith(
                "https://api-m.sandbox.paypal.com/v2/checkout/orders/mockOrderId",
                expect.objectContaining({
                    headers: {
                        Authorization: "Bearer mockAccessToken",
                        "Content-Type": "application/json",
                    },
                })
            );
        });

        it("should throw an error if the status retrieval fails", async () => {
            mockedAxios.get.mockRejectedValueOnce(new Error("Status retrieval failed"));

            await expect(paypalPayment.getOrderStatus("mockOrderId")).rejects.toThrow(
                "Status retrieval failed"
            );
        });
    });
});