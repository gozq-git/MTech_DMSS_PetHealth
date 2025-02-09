import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createApiClient, type ApiError } from './createApiClient';

describe('createApiClient', () => {
    const baseUrl = 'https://api.example.com';
    const mockFetch = vi.fn();
    global.fetch = mockFetch;
    const apiClient = createApiClient(baseUrl);

    beforeEach(() => {
        mockFetch.mockReset();
    });

    describe('GET requests', () => {
        it('should make a successful GET request', async () => {
            const mockResponse = { data: { id: 1 } };
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockResponse),
            });

            const result = await apiClient.get('/users/1');

            expect(mockFetch).toHaveBeenCalledWith(
                'https://api.example.com/users/1',
                expect.objectContaining({
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                })
            );
            expect(result).toEqual(mockResponse);
        });

        it('should handle query parameters correctly', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({}),
            });

            await apiClient.get('/users', {
                params: { page: '1', limit: '10' },
            });

            expect(mockFetch).toHaveBeenCalledWith(
                'https://api.example.com/users?page=1&limit=10',
                expect.any(Object)
            );
        });

        it('should handle error responses', async () => {
            const errorResponse: ApiError = {
                message: 'Not Found',
                code: 'RESOURCE_NOT_FOUND',
                status: 404,
            };

            mockFetch.mockResolvedValueOnce({
                ok: false,
                json: () => Promise.resolve(errorResponse),
            });

            await expect(apiClient.get('/users/999')).rejects.toEqual(errorResponse);
        });
    });

    describe('POST requests', () => {
        it('should make a successful POST request with data', async () => {
            const postData = { name: 'John Doe' };
            const mockResponse = { data: { id: 1, ...postData } };

            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockResponse),
            });

            const result = await apiClient.post('/users', postData);

            expect(mockFetch).toHaveBeenCalledWith(
                'https://api.example.com/users',
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify(postData),
                    headers: { 'Content-Type': 'application/json' },
                })
            );
            expect(result).toEqual(mockResponse);
        });
    });

    describe('PUT requests', () => {
        it('should make a successful PUT request with data', async () => {
            const putData = { name: 'Updated Name' };
            const mockResponse = { data: { id: 1, ...putData } };

            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockResponse),
            });

            const result = await apiClient.put('/users/1', putData);

            expect(mockFetch).toHaveBeenCalledWith(
                'https://api.example.com/users/1',
                expect.objectContaining({
                    method: 'PUT',
                    body: JSON.stringify(putData),
                    headers: { 'Content-Type': 'application/json' },
                })
            );
            expect(result).toEqual(mockResponse);
        });
    });

    describe('DELETE requests', () => {
        it('should make a successful DELETE request', async () => {
            const mockResponse = { success: true };
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockResponse),
            });

            const result = await apiClient.delete('/users/1');

            expect(mockFetch).toHaveBeenCalledWith(
                'https://api.example.com/users/1',
                expect.objectContaining({
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                })
            );
            expect(result).toEqual(mockResponse);
        });
    });

    describe('Error handling', () => {
        it('should handle network errors', async () => {
            const networkError = new Error('Network error');
            mockFetch.mockRejectedValueOnce(networkError);

            await expect(apiClient.get('/users')).rejects.toThrow('Network error');
        });

        it('should handle custom headers', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({}),
            });

            await apiClient.get('/users', {
                headers: {
                    'Authorization': 'Bearer token',
                },
            });

            expect(mockFetch).toHaveBeenCalledWith(
                'https://api.example.com/users',
                expect.objectContaining({
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer token',
                    },
                })
            );
        });
    });
});