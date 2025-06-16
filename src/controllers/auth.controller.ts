import { controller, httpGet, httpPost } from "inversify-express-utils";
import { inject } from "inversify";
import { IUserService } from "../services/interfaces/iuser.service";
import { Route, Get, Post, Tags, Body, Controller, Security, Request } from "tsoa";
import { AuthRequest, UserEmail } from "../entities/user";
import { IAuthService } from "../services/interfaces/iauth.service";
import { GeneralResponse } from "../business_objects/general.response";
import { SuccessCode } from "../utils/enums/enums";
import { validate } from "../utils/password/validate";

@Route("badminton/v1/auth")
@Tags("Authentication")
@controller("badminton/v1/auth")
export class AuthController extends Controller {
    constructor(@inject("IAuthService") private readonly authService: IAuthService,
                @inject("IUserService") private readonly userService: IUserService) {
        super();
    }

    /**
     * Đăng nhập người dùng.
     * @param loginData Thông tin đăng nhập.
     * @returns Thông tin xác thực và token.
     */
    @Post("/user")
    @httpPost("/user")
    public async login(@Body() loginData: AuthRequest): Promise<GeneralResponse> {
        await validate(AuthRequest, loginData);
        return new GeneralResponse(SuccessCode.OPERATION_SUCCESS,
            await this.authService.login(loginData));
    }

    /**
     * Lấy thông tin người dùng hiện tại.
     * @param req Request chứa thông tin người dùng.
     * @returns Thông tin người dùng.
     */
    @Get("/me")
    @httpGet("/me")
    @Security("jwt")
    public async getCurrentLogin(@Request() req: { user: UserEmail }): Promise<GeneralResponse> {
        return new GeneralResponse(SuccessCode.OPERATION_SUCCESS,
            await this.userService.getUserByEmail(req.user.email));
    }
}