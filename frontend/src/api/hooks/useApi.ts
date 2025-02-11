// src/hooks/useApi.ts

import { useState, useCallback } from 'react';
import {ApiClient, ApiError, RequestConfig} from "../client/createApiClient.ts";

// This defines the shape of an object that useApi will return
interface UseApiResponse<T> {
    data: T | null;      // Can be of type T or null
    loading: boolean;    // True/false flag for loading state
    error: ApiError | null;  // Can be ApiError type or null
    request: <R extends T>(  // A function that accepts a type R that must extend T
        method: keyof ApiClient,  // Must be a key from ApiClient (get/post/put/delete)
        endpoint: string,         // API endpoint path
        data?: unknown,          // Optional data parameter of any type
        config?: RequestConfig   // Optional config parameter
    ) => Promise<R>;          // Returns a Promise that resolves to type R
}

// Custom hook that takes an ApiClient and returns UseApiResponse
export const useApi = <T>(apiClient: ApiClient): UseApiResponse<T> => {
    // State hooks with types
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<ApiError | null>(null);

    // useCallback to memoize the request function
    const request = useCallback(async <R extends T>(
        method: keyof ApiClient,
        endpoint: string,
        data?: unknown,
        config?: RequestConfig
    ): Promise<R> => {
        setLoading(true);
        setError(null);

        try {
            let result: R;  // Declare variable of type R
            // Conditional execution based on HTTP method
            // TODO: Not sure if get request can also have data, tbc
            if (method === 'get' || method === 'delete') {
                result = await apiClient[method]<R>(endpoint, config);
            } else {
                result = await apiClient[method]<R>(endpoint, data, config);
            }
            setData(result);  // Update state with result
            return result;
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError);
            throw apiError;
        } finally {
            setLoading(false);  // Reset loading to false
        }
    }, [apiClient]);  // Dependency array for useCallback

    // Return object matching UseApiResponse interface
    return { data, loading, error, request };
};