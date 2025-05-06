// src/api/client/userApi.ts
import {BaseApiClient} from "./createApiClient.ts";
import {User, UserUpdateInput} from "../types/user.ts";


type UserApiResponse = {
    success: boolean;
    data: User | null;
    message: string;
};

export interface UserApi {
    retrieveUser: () => Promise<UserApiResponse>;
    registerUser: (userData: any) => Promise<UserApiResponse>;
    updateUser: (userUpdateInput: UserUpdateInput) => Promise<UserApiResponse>;
}

export const createUserApiClient = (baseClient: BaseApiClient): UserApi => {
    return {
        retrieveUser: async (): Promise<UserApiResponse> => {
            try {
                // Get the raw response from the API
                const response = await baseClient.get<{
                    status: 'success' | 'error';
                    message: User | string | any;
                }>(`/api/users/retrieveUser`);

                if (response.status === 'success') {
                    return {
                        success: true,
                        data: response.message as User,
                        message: 'User retrieved successfully'
                    };
                } else {
                    return {
                        success: false,
                        data: null,
                        message: typeof response.message === 'string'
                            ? response.message
                            : 'Failed to retrieve user'
                    };
                }
            } catch (error) {
                console.error('Error retrieving user:', error);
                return {
                    success: false,
                    data: null,
                    message: error instanceof Error ? error.message : 'An unexpected error occurred'
                };
            }
        },
        registerUser: async (userData): Promise<UserApiResponse> => {
            try {
                const response = await baseClient.post<{
                    status: 'success' | 'error';
                    message: User | string | any;
                }>('/api/users/registerUser', userData);

                if (response.status === 'success') {
                    return {
                        success: true,
                        data: response.message as User,
                        message: 'User registered successfully'
                    };
                } else {
                    return {
                        success: false,
                        data: null,
                        message: typeof response.message === 'string'
                            ? response.message
                            : 'Failed to register user'
                    };
                }
            } catch (error) {
                console.error('Error registering user:', error);
                // Check for specific errors from the backend
                if (error instanceof Error && error.message.includes('User already exists')) {
                    return {
                        success: false,
                        data: null,
                        message: 'A user with this account name already exists'
                    };
                }

                return {
                    success: false,
                    data: null,
                    message: error instanceof Error ? error.message : 'An unexpected error occurred'
                };
            }
        },
        updateUser: async (userUpdateInput): Promise<UserApiResponse> => {
            try {
                const response = await baseClient.post<{
                    status: 'success' | 'error';
                    message: User | string | any;
                }>(`/api/users/updateUser`, {...userUpdateInput});

                if (response.status === 'success') {
                    return {
                        success: true,
                        data: response.message as User,
                        message: 'User updated successfully'
                    };
                } else {
                    return {
                        success: false,
                        data: null,
                        message: typeof response.message === 'string'
                            ? response.message
                            : 'Failed to update user'
                    };
                }
            } catch (error) {
                console.error('Error updating user:', error);
                return {
                    success: false,
                    data: null,
                    message: error instanceof Error ? error.message : 'An unexpected error occurred'
                };
            }
        }
    };
};
