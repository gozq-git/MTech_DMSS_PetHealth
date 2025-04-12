/**
 * src/api/createApiClient.ts
 */
import { acquireAccessToken } from "../../auth/msalService.ts";
import { msalInstance } from "../../main.tsx";

export interface ApiError {
    message: string;
    code: string;
    status: number;
}

export interface RequestConfig extends RequestInit {
    params?: Record<string, string>;
}

export interface BaseApiClient {
    get: <T>(endpoint: string, config?: RequestConfig) => Promise<T>;
    post: <T>(endpoint: string, data?: unknown, config?: RequestConfig) => Promise<T>;
    put: <T>(endpoint: string, data?: unknown, config?: RequestConfig) => Promise<T>;
    delete: <T>(endpoint: string, config?: RequestConfig) => Promise<T>;
}

/**
 * Creates an API client for making HTTP requests
 * @param baseUrl - Base URL for all API requests
 * @returns API client instance with HTTP methods
 */
export const createApiClient = (baseUrl: string): BaseApiClient => {

    const request = async <T>(endpoint: string, options: RequestConfig = {}): Promise<T> => {
        const { params, ...config } = options;
        const queryString = params ? `?${new URLSearchParams(params)}` : '';
        const accessToken = await acquireAccessToken(msalInstance)
        const headers = {
            'Content-Type': 'application/json',
            ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
            ...options.headers,
        };

        try {
            console.log("=== REQUEST DETAILS ===");
            console.log("URL:", `${baseUrl}${endpoint}${queryString}`);
            console.log("Method:", config.method);
            console.log("Headers:", headers);
            console.log("Body:", config.body);
            const response = await fetch(`${baseUrl}${endpoint}${queryString}`, {
                ...config,
                headers,
            });
            console.log(response);
            if (!response.ok) {
                throw await response.json();
            }

            return response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    };

    return {
        get: <T>(endpoint: string, config?: RequestConfig) =>
            request<T>(endpoint, { ...config, method: 'GET' }),

        post: <T>(endpoint: string, data?: unknown, config?: RequestConfig) =>
            request<T>(endpoint, {
                ...config,
                method: 'POST',
                body: JSON.stringify(data),
            }),

        put: <T>(endpoint: string, data?: unknown, config?: RequestConfig) =>
            request<T>(endpoint, {
                ...config,
                method: 'PUT',
                body: JSON.stringify(data),
            }),

        delete: <T>(endpoint: string, config?: RequestConfig) =>
            request<T>(endpoint, { ...config, method: 'DELETE' }),
    };
};
