// src/api/client/paymentApi.ts
import { BaseApiClient } from "./createApiClient.ts";

// Common response structure for all API calls
type ApiResponse<T> = {
    success: boolean;
    data?: T;
    error?: {
        message: string;
        code?: string;
    };
};

// Request and response types
type CreatePaymentRequest = {
    amount: number;
    currency: string;
    description: string;
    paymentType: string;
};

type CreatePaymentData = {
    paymentId: string;
};

type CapturePaymentRequest = {
    paymentId: string;
};

type CapturePaymentData = {
    success: boolean;
};

type PaymentStatusData = {
    status: string;
};

export interface PaymentApi {
    createPayment(createPaymentRequest: CreatePaymentRequest): Promise<ApiResponse<CreatePaymentData>>;
    capturePayment(capturePaymentReq: CapturePaymentRequest): Promise<ApiResponse<CapturePaymentData>>;
    getPaymentStatus(paymentId: string): Promise<ApiResponse<PaymentStatusData>>;
}

export const createPaymentApiClient = (baseClient: BaseApiClient): PaymentApi => {
    // Generic handler for API calls to ensure consistent error handling
    const handleApiCall = async <T>(
        apiCall: () => Promise<T>
    ): Promise<ApiResponse<T>> => {
        try {
            const data = await apiCall();
            return {
                success: true,
                data
            };
        } catch (error) {
            console.error("API Error:", error);
            return {
                success: false,
                error: {
                    message: error instanceof Error ? error.message : "An unknown error occurred",
                    code: (error as any)?.code || "UNKNOWN_ERROR"
                }
            };
        }
    };

    return {
        createPayment: async (createPaymentRequest: CreatePaymentRequest): Promise<ApiResponse<CreatePaymentData>> => {
            return handleApiCall(async () => {
                return await baseClient.post<CreatePaymentData>(`/api/payments/create`, createPaymentRequest);
            });
        },

        capturePayment: async (capturePaymentReq: CapturePaymentRequest): Promise<ApiResponse<CapturePaymentData>> => {
            return handleApiCall(async () => {
                return await baseClient.post<CapturePaymentData>(`/api/payments/capture`, capturePaymentReq);
            });
        },

        getPaymentStatus: async (paymentId: string): Promise<ApiResponse<PaymentStatusData>> => {
            return handleApiCall(async () => {
                return await baseClient.get<PaymentStatusData>(`/api/payments/status/${paymentId}`);
            });
        },
    };
};