export interface AuthResponse {
    email: string;
    role: string;
    token: string;
    refreshToken: string;
    message: string;
    name?: string; // optional display name
    success?: boolean;
}
