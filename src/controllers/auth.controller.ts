import { controller, httpGet, httpPost } from "inversify-express-utils";
import { inject, injectable } from "inversify";
import { IUserService } from "../services/interfaces/iuser.service";
import { Route, Get, Post, Tags, Query, Body, SuccessResponse, Controller, Security, Request } from "tsoa";
import { AuthRequest, AuthResponse, BaseUser, CreateUserDTO, UserEmail } from "../entities/user";
import { IAuthService } from "../services/interfaces/iauth.service";

@Route("badminton/v1/auth")
@Tags("Authentication")
@controller("badminton/v1/auth")
export class AuthController extends Controller {
    constructor(@inject("IAuthService") private readonly authService: IAuthService,
                @inject("IUserService") private readonly userService: IUserService) {
        super();
    }

    @Post("/user")
    @httpPost("/user")
    public async login(@Body() loginData: AuthRequest): Promise<AuthResponse> {
        return await this.authService.login(loginData);
    }

    @Get("/me")
    @httpGet("/me")
    @Security("jwt")
    public async getCurrentLogin(@Request() req: { user: UserEmail }): Promise<BaseUser | null> {
        return await this.userService.getUserByEmail(req.user.email);
    }
}