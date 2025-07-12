// Authentication related types and interfaces

export interface User {
    id: string;
    username: string;
    email: string;
    reputation: number;
    avatarUrl?: string;
    createdAt: string;
    updatedAt: string;
    isAdmin?: boolean;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface SignupRequest {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

export interface LoginFormData {
    email: string;
    password: string;
}

export interface SignupFormData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

// Backend response types
export interface BackendUserProfile {
    id: number;
    username: string;
    user_email: string;
}

export interface BackendAdminProfile {
    id: number;
    username: string;
    admin_email: string;
}

export interface BackendLoginResponse {
    message: string;
    user: BackendUserProfile;
    tokens: {
        access: string;
        refresh: string;
    };
}

export interface BackendAdminLoginResponse {
    message: string;
    admin: BackendAdminProfile;
    tokens: {
        access: string;
        refresh: string;
    };
}

export interface BackendRegisterResponse {
    message: string;
    user: BackendUserProfile;
}

export interface BackendAdminRegisterResponse {
    message: string;
    admin: BackendAdminProfile;
}
