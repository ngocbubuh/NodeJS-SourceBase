import * as express from "express";
import * as jwt from "jsonwebtoken";
import config, { AuthConfig } from "../utils/environments/environment";
import { User } from "../entities/user";
import { ErrorResponse, UnauthResponse } from "../business_objects/error.response";
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
                return reject(new UnauthResponse("No token provided"));
            }

            jwt.verify(token, config.auth.jwtSecret, function (err: any, decoded: any) {
                if (err) {
                    return reject(err);
                }

                if (decoded.type !== "access") {
                    return reject(new UnauthResponse("Invalid token type. Only access tokens are allowed."));
                }

                const user: Partial<User> = {
                    email: decoded.email,
                    role: decoded.role.toUpperCase(), // Normalize case
                };

                if (!user.email || !user.role) {
                    return reject(new UnauthResponse("Token is missing required claims"));
                }

                // Role-based validation: Check if the user's role is in requiredRoles
                if (Array.isArray(requiredRoles) && requiredRoles.length > 0) {
                    if (!requiredRoles.includes(user.role)) {
                        return reject(new UnauthResponse(`Access denied. Required roles: ${requiredRoles.join(", ")}`));
                    }
                }

                resolve(user);
            });
        });
    }

    // Fix: Ensure the function always returns a rejected Promise if securityName is invalid
    return Promise.reject(new Error("Invalid security name"));
}
