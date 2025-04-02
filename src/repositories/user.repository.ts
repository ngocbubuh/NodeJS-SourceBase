import { injectable } from "inversify";
import { User } from "../entities/user";
import { GenericRepository } from "./generic.repository";
import { IUserRepository } from "./interfaces/iuser.repository";
import { PrismaClient } from "@prisma/client";

@injectable()
export class UserRepository extends GenericRepository<User> implements IUserRepository { 
    constructor() {
        super("user"); // Prisma table name
    }

    public async getByEmail(email: string): Promise<User | null> {
        return await this.entity.findUnique({
            where: {
                email
            }
        });
    }
}