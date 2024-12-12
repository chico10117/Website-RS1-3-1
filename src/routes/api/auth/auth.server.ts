import type { AuthRequest, AuthResponse } from '$lib/types/server-types';

export class AuthServer {
    async authenticate(request: AuthRequest): Promise<AuthResponse> {
        // Authentication logic
    }
} 