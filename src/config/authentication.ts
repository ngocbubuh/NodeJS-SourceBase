import * as express from "express";
import * as jwt from "jsonwebtoken";
import config from "../utils/environments/environment";
import { User } from "../entities/user";
import { ErrorResponseV2, RejectResponseV2, UnAuthResponseV2 } from "../business_objects/error.response";
import { ErrorCode } from "../utils/enums/enums";
export function expressAuthentication(
    request: express.Request,
    securityName: string,
    requiredRoles?: string[] // Change _scopes to requiredRoles
): Promise<any> {
    if (securityName === "jwt") {
        const authHeader = request.headers["authorization"];

        let token = null;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1]; // Extract token after "Bearer "
        } else {
            token =
                request.body.token ||
                request.query.token ||
                request.headers["x-access-token"];
        }

        return new Promise((resolve, reject) => {
            if (!token) {
                return reject(new UnAuthResponseV2(ErrorCode.REQUIRED_TOKEN));
            }
            try {
                jwt.verify(token, config.auth.jwtSecret, function (err: any, decoded: any) {
                    if (err instanceof jwt.TokenExpiredError) {
                        return reject(new UnAuthResponseV2(ErrorCode.EXPIRED_TOKEN, err));
                    } else if (err) {
                        return reject(new UnAuthResponseV2(ErrorCode.INVALID_TOKEN_CLAIM))
                    }

                    if (decoded.type !== "access") {
                        return reject(new UnAuthResponseV2(ErrorCode.INVALID_TOKEN_TYPE));
                    }

                const user: Partial<User> = {
                    email: decoded.email,
                    role: decoded.role.toUpperCase(),
                };

                if (!user.email || !user.role) {
                    return reject(new UnAuthResponseV2(ErrorCode.INVALID_TOKEN_CLAIM));
                }

                // Role-based validation: Check if the user's role is in requiredRoles
                    if (Array.isArray(requiredRoles) && requiredRoles.length > 0) {
                        if (!requiredRoles.includes(user.role)) {
                        return reject(new RejectResponseV2(ErrorCode.INVALID_ROLES_CLAIM));
                    }
                }

                resolve(user);
                });
            } catch (ex) {
            }
        });
    }

    // Fix: Ensure the function always returns a rejected Promise if securityName is invalid
    return Promise.reject(new ErrorResponseV2(ErrorCode.INVALID_TOKEN_TYPE));
}
