import { inject, injectable } from "inversify";
import { AuthRequest, AuthResponse, RefreshTokenRequest, User } from "../entities/user";
import { IUserRepository } from "../repositories/interfaces/iuser.repository";
import { IAuthService } from "./interfaces/iauth.service";
import { PasswordUtil } from "../utils/password/password.util";
import { ErrorResponse } from "../business_objects/error.response";
import { AuthUtil } from "../utils/password/auth.util";

@injectable()
export class AuthService implements IAuthService {
    constructor(@inject("IUserRepository") private userRepository: IUserRepository) { }

    public async login(loginData: AuthRequest): Promise<AuthResponse> {
        var user = await this.userRepository.getByEmail(loginData.email);
        if (!user) {
            throw new ErrorResponse("Incorrect email or password!"); //Tuong lai lam` language util
        }
        else if (user.delFlag) {
            throw new ErrorResponse("Your account has been suspended!");
        }
        var isValidPassword = await PasswordUtil.comparePassword(loginData.password, user.password);
        if (!isValidPassword) {
            throw new ErrorResponse("Incorrect email or password!");
        }
        return AuthUtil.generateAuthToken(user);
    }

    refreshToken(refreshData: RefreshTokenRequest): Promise<AuthResponse> {
        throw new Error("Method not implemented.");
    }
}