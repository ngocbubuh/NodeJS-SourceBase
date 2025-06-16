import { controller, httpDelete, httpGet, httpPost, httpPut } from "inversify-express-utils";
import { inject } from "inversify";
import { IUserService } from "../services/interfaces/iuser.service";
import { Route, Get, Post, Tags, Query, Body, Controller, Put, Delete, Path, Security, Request } from "tsoa";
import { CreateUserDTO, UpdateUserDTO, UserEmail } from "../entities/user";
import { PaginationParameter } from "../business_objects/pagination";
import { GeneralResponse } from "../business_objects/general.response";
import { SuccessCode } from "../utils/enums/enums";
import { validate } from "../utils/password/validate";
import { UserRole } from "@prisma/client";

@Route("badminton/v1/users")
@Tags("User Management")
@controller("badminton/v1/users")
export class UserController extends Controller {
    constructor(@inject("IUserService") private readonly userService: IUserService) {
        super(); 
    }

    /**
     * Lấy thông tin người dùng theo ID.
     * @param id ID của người dùng.
     * @returns Thông tin người dùng.
     */
    @Get("/")
    @httpGet("/")
    @Security("jwt", ["ADMIN"])
    public async getUsers(@Query() id: number): Promise<GeneralResponse> {
        return new GeneralResponse(SuccessCode.OPERATION_SUCCESS,
            await this.userService.getUser(id));
    }

    /**
     * Lấy thông tin người dùng theo email.
     * @param email Email của người dùng.
     * @returns Thông tin người dùng.
     */
    @Get("/email/{email}")
    @httpGet("/email/{email}")
    @Security("jwt", ["ADMIN"])
    public async getUsersByEmail(@Path() email: string): Promise<GeneralResponse> {
        return new GeneralResponse(SuccessCode.OPERATION_SUCCESS,
            await this.userService.getUserByEmail(email));
    }

    /**
     * Lấy danh sách tất cả người dùng với phân trang.
     * @param pageIndex Chỉ số trang.
     * @param pageSize Kích thước trang.
     * @returns Danh sách người dùng với phân trang.
     */
    @Get("/all")
    @httpGet("/all")
    @Security("jwt", ["ADMIN"])
    public async getAllUsers(@Query() pageIndex?: number, @Query() pageSize?: number): Promise<GeneralResponse> {
        return new GeneralResponse(SuccessCode.OPERATION_SUCCESS,
            await this.userService.getAllUser(new PaginationParameter(pageIndex, pageSize)));
    }

    /**
     * Đăng ký tài khoản mới (chỉ admin)
     * @param userData Dữ liệu người dùng cần tạo.
     * @returns Thông tin người dùng vừa tạo.
     */
    @Post("/signUpInternal")
    @httpPost("/signUpInternal")
    @Security("jwt", ["ADMIN"])
    public async createUserInternal(@Body() userData: CreateUserDTO): Promise<GeneralResponse> {
        await validate(CreateUserDTO, userData);
        return new GeneralResponse(SuccessCode.OPERATION_SUCCESS,
            await this.userService.createUser(userData));
    }

    /**
     * Đăng ký tài khoản mới (auto role: user)
     * @param userData Dữ liệu người dùng cần tạo.
     * @returns Thông tin người dùng vừa tạo.
     */
    @Post("/signUp")
    @httpPost("/signUp")
    public async createUser(@Body() userData: CreateUserDTO): Promise<GeneralResponse> {
        await validate(CreateUserDTO, userData);
        userData.role = UserRole.user; //Auto user role
        return new GeneralResponse(SuccessCode.OPERATION_SUCCESS,
            await this.userService.createUser(userData));
    }

    /**
     * Cập nhật thông tin người dùng (chỉ Admin).
     * @param id ID của người dùng.
     * @param newData Dữ liệu mới cần cập nhật.
     * @returns Thông tin người dùng sau khi cập nhật.
     */
    @Put("/")
    @httpPut("/")
    @Security("jwt", ["ADMIN"])
    public async updateUser(@Query() id: number, @Body() newData: UpdateUserDTO): Promise<GeneralResponse> {
        await validate(UpdateUserDTO, newData);
        return new GeneralResponse(SuccessCode.OPERATION_SUCCESS,
            await this.userService.updateUsers(id, newData));
    }

    /**
     * Cập nhật thông tin của bản thân.
     * @param req Request chứa thông tin người dùng.
     * @param newData Dữ liệu mới cần cập nhật.
     * @returns Thông tin người dùng sau khi cập nhật.
     */
    @Put("/me")
    @httpPut("/me")
    @Security("jwt")
    public async updateCurrentUser(@Request() req: { user: UserEmail }, @Body() newData: UpdateUserDTO): Promise<GeneralResponse> {
        await validate(UpdateUserDTO, newData);
        return new GeneralResponse(SuccessCode.OPERATION_SUCCESS,
            await this.userService.updateCurrentUsers(req.user.email, newData));
    }

    /**
     * Xóa người dùng theo ID (chỉ Admin).
     * @param id ID của người dùng cần xóa.
     * @returns Kết quả xóa người dùng.
     */
    @Delete("/")
    @httpDelete("/")
    @Security("jwt", ["ADMIN"])
    public async deleteUser(@Query() id: number): Promise<GeneralResponse> {
        return new GeneralResponse(SuccessCode.OPERATION_SUCCESS,
            await this.userService.deleteUsers(id));
    }
}