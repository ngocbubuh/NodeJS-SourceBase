import { inject, injectable } from "inversify";
import { IUserService } from "./interfaces/iuser.service";
import { IUserRepository } from "../repositories/interfaces/iuser.repository";
import { CreateUserDTO, BaseUser, User, UpdateUserDTO } from "../entities/user";
import { PasswordUtil } from "../utils/password/password.util";
import { instanceToInstance, plainToClass, plainToInstance } from "class-transformer";
import { ErrorResponse } from "../business_objects/error.response"
import { Pagination, PaginationParameter } from "../business_objects/pagination";

@injectable()
export class UserService implements IUserService {
    constructor(@inject("IUserRepository") private userRepository: IUserRepository) { }

    public async createUser(userData: CreateUserDTO): Promise<BaseUser> {
        delete userData.confirmPassword;
        const user = plainToClass(User, userData, { excludeExtraneousValues: true });
        user.emailVerified = false;
        user.password = await PasswordUtil.hashPassword(user.password);
        return plainToClass(BaseUser, await this.userRepository.create(user), { excludeExtraneousValues: true });
    }

    public async getUser(id: number): Promise<BaseUser | null> {
        return plainToClass(BaseUser, await this.userRepository.getById(id), { excludeExtraneousValues: true });
    }

    public async getUserByEmail(email: string): Promise<BaseUser | null> {
        return plainToClass(BaseUser, await this.userRepository.getByEmail(email), { excludeExtraneousValues: true });
    }

    public async getAllUser(para: PaginationParameter): Promise<Pagination<BaseUser>> {
        const source = await this.userRepository.getAll(para);
        const items = plainToInstance(BaseUser, source.items, { excludeExtraneousValues: true });
        return new Pagination<BaseUser>(items, source.totalCount, source.currentPage, source.pageSize);
    }

    public async updateUsers(id: number, newData: UpdateUserDTO): Promise<BaseUser> {
        var user = await this.userRepository.getById(id);
        if (!user) {
            throw new ErrorResponse("User not found!")
        }
        return plainToClass(BaseUser, await this.userRepository.update(id, newData), { excludeExtraneousValues: true });
    }

    public async updateCurrentUsers(email: string, newData: UpdateUserDTO): Promise<BaseUser> {
        var user = await this.userRepository.getByEmail(email);
        if (!user || !user.id) {
            throw new ErrorResponse("User not found!")
        }
        return plainToClass(BaseUser, await this.userRepository.update(user.id, newData), { excludeExtraneousValues: true });
    }

    public async deleteUsers(id: number): Promise<BaseUser> {
        return plainToClass(BaseUser, await this.userRepository.delete(id), { excludeExtraneousValues: true })
    }
}