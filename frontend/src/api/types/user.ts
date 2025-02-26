// src/api/types/user.ts
export interface User {
    id: string;
    name: string;
    email: string;
    lastActive: string;
    bio: string;
    profilePictureUrl: string;
    accountType: 'user' | 'vet';
    accountCreated: string;
    isDeleted: boolean;
}

export interface UserCreateInput {
    name: string;
    email: string;
    password: string;
    role?: 'admin' | 'user';
}

export interface UserUpdateInput {
    name?: string;
    email?: string;
    role?: 'admin' | 'user';
}