// src/api/client/userApi.ts
import {BaseApiClient} from "./createApiClient.ts";
import {User} from "../types/user.ts";

export interface UserApi {
    getUsers: () => Promise<User[]>;
    retrieveUser: () => Promise<User[]>;
    registerUser: (userData: Omit<User, 'id'>) => Promise<User>;
    updateUser: (userId: string, userData: Partial<User>) => Promise<User>;
}

export const createUserApiClient = (baseClient: BaseApiClient): UserApi => {
    return {
        getUsers: () => baseClient.get<User[]>('/api/users/getUsers'),
        retrieveUser: () => baseClient.get<User[]>(`/api/users/retrieveUser`),
        registerUser: (userData) => baseClient.post<User>('/api/users', userData),
        updateUser: (userId, userData) => baseClient.put<User>(`/api/users/${userId}`, userData)
    };
};
