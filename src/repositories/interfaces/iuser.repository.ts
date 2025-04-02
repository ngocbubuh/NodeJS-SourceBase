import { User } from "../../entities/user";
import { IGenericRepository } from "./igeneric.repository";

export interface IUserRepository extends IGenericRepository<User> {
    getByEmail(email: string): Promise<User | null>;
}