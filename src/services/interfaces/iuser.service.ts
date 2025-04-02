import { Pagination, PaginationParameter } from "../../business_objects/pagination";
import { BaseUser, CreateUserDTO, UpdateUserDTO } from "../../entities/user";

export interface IUserService {
    createUser(user: CreateUserDTO): Promise<BaseUser>;
    getUser(id: number): Promise<BaseUser | null>;
    getAllUser(para: PaginationParameter): Promise<Pagination<BaseUser>>;
    getUserByEmail(email: string): Promise<BaseUser | null>;
    updateUsers(id: number, newData: UpdateUserDTO): Promise<BaseUser>;
    updateCurrentUsers(email: string, newData: UpdateUserDTO): Promise<BaseUser>;
    deleteUsers(id: number): Promise<BaseUser>;
}