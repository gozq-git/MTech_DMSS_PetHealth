// src/api/types/user.ts
// User interface
export interface User {
    ID?: string;
    account_name?: string;
    display_name?: string;
    email?: string;
    account_type?: string;
    bio?: string;
    profile_picture?: string;
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