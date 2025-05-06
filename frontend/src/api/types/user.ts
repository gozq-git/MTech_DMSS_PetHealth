// src/api/types/user.ts
// User interface
export interface User {
    id: string;
    account_name: string;
    display_name: string;
    email: string;
    last_active: string;
    account_created: string;
    bio: string;
    profile_picture: string;
    VET: any | null;
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
    // Additional vet fields:
    vet_license?: string;
    vet_center?: string;
    vet_phone?: string;
    vet_name?: string; 
}