import { AuthRequest, AuthResponse, RefreshTokenRequest } from "../../entities/user";

export interface IAuthService {
    login(loginData: AuthRequest): Promise<AuthResponse>;
    refreshToken(refreshData: RefreshTokenRequest): Promise<AuthResponse>;
}