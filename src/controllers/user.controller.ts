import { validate } from "class-validator";
import { controller, httpDelete, httpGet, httpPost, httpPut } from "inversify-express-utils";
import { inject, injectable } from "inversify";
import { IUserService } from "../services/interfaces/iuser.service";
import { Route, Get, Post, Tags, Query, Body, SuccessResponse, Controller, Put, Delete, Path, Security, Request } from "tsoa";
import { BaseUser, CreateUserDTO, UpdateUserDTO, User, UserEmail } from "../entities/user";
import { query } from "express";
import { ErrorResponse } from "../business_objects/error.response";
import { Pagination, PaginationParameter } from "../business_objects/pagination";
import { plainToClass } from "class-transformer";

@Route("badminton/v1/users")
@Tags("User Management")
@controller("badminton/v1/users")
export class UserController extends Controller {
    constructor(@inject("IUserService") private readonly userService: IUserService) {
        super(); 
    }

    @Get("/")
    @httpGet("/")
    @Security("jwt", ["ADMIN"])
    public async getUsers(@Query() id: number): Promise<BaseUser | null> {
        return this.userService.getUser(id);
    }

    @Get("/email/{email}")
    @httpGet("/email/{email}")
    @Security("jwt", ["ADMIN"])
    public async getUsersByEmail(@Path() email: string): Promise<BaseUser | null> {
        return this.userService.getUserByEmail(email);
    }

    @Get("/all")
    @httpGet("/all")
    @Security("jwt", ["ADMIN"])
    public async getAllUsers(@Query() pageIndex?: number, @Query() pageSize?: number): Promise<Pagination<BaseUser>> {
        return this.userService.getAllUser(new PaginationParameter(pageIndex, pageSize));
    }

    @Post("/")
    @httpPost("/")
    //@Security("jwt", ["ADMIN"]) //API for Admin to create any account
    public async createUser(@Body() userData: CreateUserDTO): Promise<any> {
        return this.userService.createUser(userData);
    }

    @Put("/")
    @httpPut("/")
    @Security("jwt", ["ADMIN"])
    public async updateUser(@Query() id: number, @Body() newData: UpdateUserDTO): Promise<BaseUser> {
        return this.userService.updateUsers(id, newData);
    }

    @Put("/me")
    @httpPut("/me")
    @Security("jwt")
    public async updateCurrentUser(@Request() req: { user: UserEmail }, @Body() newData: UpdateUserDTO): Promise<BaseUser> {
        return this.userService.updateCurrentUsers(req.user.email, newData);
    }

    @Delete("/")
    @httpDelete("/")
    @Security("jwt", ["ADMIN"])
    public async deleteUser(@Query() id: number): Promise<BaseUser> {
        return this.userService.deleteUsers(id);
    }
}