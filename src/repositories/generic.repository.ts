import { PrismaClient } from "@prisma/client";
import { injectable, unmanaged } from "inversify";
import { IGenericRepository } from "./interfaces/igeneric.repository";
import { BaseEntity } from "../entities/base/base.entity";
import { Pagination, PaginationParameter } from "../business_objects/pagination";
import { prismaManager } from "../utils/prisma";
import { PrismaModels, ModelClient } from "../utils/prismaTypes";

@injectable()
export class GenericRepository<T extends BaseEntity, M extends PrismaModels = PrismaModels> implements IGenericRepository<T> {
    protected readonly entity: M;

    constructor(@unmanaged() entity: M) {
        this.entity = entity;
    }

    protected getModel(client: PrismaClient): ModelClient<M> {
        return client[this.entity];
    }

    async getAll(para: PaginationParameter): Promise<Pagination<T>> {
        return prismaManager.withConnection(async (client) => {
            const model = this.getModel(client);
            const skip = (para.pageIndex - 1) * para.pageSize;
            const [items, count] = await Promise.all([
                (model as any).findMany({
                    skip,
                    take: para.pageSize,
                    where: { delFlag: false }
                }),
                (model as any).count({
                    where: { delFlag: false }
                })
            ]);
            return new Pagination<T>(items, count, para.pageIndex, para.pageSize);
        });
    }

    async getById(id: number): Promise<T | null> {
        return prismaManager.withConnection(async (client) => {
            const model = this.getModel(client);
            return await (model as any).findUnique({
                where: {
                    id,
                    delFlag: false
                },
            });
        });
    }

    async create(data: T): Promise<T> {
        return prismaManager.withConnection(async (client) => {
            const model = this.getModel(client);
            return await (model as any).create({
                data: data,
            });
        });
    }

    async update(id: number, data: Partial<T>): Promise<T> {
        return prismaManager.withConnection(async (client) => {
            const model = this.getModel(client);
            return await (model as any).update({
                where: { id },
                data: data,
            });
        });
    }

    async delete(id: number): Promise<T> {
        return prismaManager.withConnection(async (client) => {
            const model = this.getModel(client);
            return await (model as any).update({
                where: { id },
                data: { delFlag: true }
            });
        });
    }
}
