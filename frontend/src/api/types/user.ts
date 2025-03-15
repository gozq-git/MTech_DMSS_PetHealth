// src/api/types/user.ts
export interface User {
    ID: string; 
    account_name: string;
    display_name: string;
    email: string;
    last_active: string;
    bio: string;
    profile_picture: string;
    ACCOUNT_TYPE: string;
    account_created: string;
    isDeleted: boolean;
}

export interface UserCreateInput extends Omit<User, 'id'> {
    role?: 'admin' | 'user'; // Optional role field
}

export interface UserUpdateInput {
    account_name?: string;
    display_name?: string;
    email?: string;
    bio?: string;
    profile_picture?: string;
    role?: 'admin' | 'user';
}