import { AuthResponse, User } from "../../entities/user";
import jwt from "jsonwebtoken";
import config, { AuthConfig } from "../environments/environment";
import * as crypto from "crypto";
import { ErrorResponseV2 } from "../../business_objects/error.response";
import { ErrorCode } from "../enums/enums";

export class AuthUtil {
    private static readonly config: AuthConfig = config.auth;

    public static generateAuthToken(userData: User): AuthResponse {
        if (!userData.email || !userData.role) {
            throw new ErrorResponseV2(ErrorCode.MISSING_REQUIRED_DATA);
        }
        return {
            accessToken: this.generateToken(userData, "access", this.config.accessTokenExpires),
            refreshToken: this.generateToken(userData, "refresh", this.config.refreshTokenExpires)
        };
    }

    private static generateToken(userData: User, type: string, expiresIn: any): string {
        const claims = {
            email: userData.email,
            role: userData.role.toUpperCase(),
            jti: crypto.randomUUID(),
            type: type,
        };

        const signOptions: jwt.SignOptions = {
            expiresIn,
        };
        return jwt.sign(claims, String(this.config.jwtSecret), signOptions);
    }
}