export interface User {
    id: number;
    email: string;
    firstName?: string;
    lastName?: string;
    role: string;
    status?: string;
}

export interface AuthResponse {
    token: string;
    email: string;
    role: string;
    status: string;
}
