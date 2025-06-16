import { injectable } from "inversify";
import { User } from "../entities/user";
import { GenericRepository } from "./generic.repository";
import { IUserRepository } from "./interfaces/iuser.repository";
import { PrismaClient } from "@prisma/client";
import { prismaManager } from "../utils/prisma";

@injectable()
export class UserRepository extends GenericRepository<User, "user"> implements IUserRepository { 
    constructor() {
        super("user"); // Prisma table name
    }

    public async getByEmail(email: string): Promise<User | null> {
        return prismaManager.withConnection(async (client: PrismaClient) => {
            return client.user.findUnique({
                where: { email, delFlag: false }
            });
        });
    }
}