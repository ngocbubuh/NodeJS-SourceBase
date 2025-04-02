import { PrismaClient } from "@prisma/client";
import { injectable, unmanaged } from "inversify";
import { IGenericRepository } from "./interfaces/igeneric.repository";
import { BaseEntity } from "../entities/base/base.entity";
import { Pagination, PaginationParameter } from "../business_objects/pagination";

@injectable()
export class GenericRepository<T extends BaseEntity> implements IGenericRepository<T> {
    protected readonly prisma: PrismaClient;
    protected readonly entity: any;

    constructor(@unmanaged() entity: any) {
        this.prisma = new PrismaClient();
        this.entity = this.prisma[entity];
    }

    async getAll(para: PaginationParameter): Promise<Pagination<any>> {
        const skip = (para.pageIndex - 1) * para.pageSize;
        const [items, count] = await Promise.all([
            this.entity.findMany({
                skip,
                take: para.pageSize,
                where: { delFlag: false }
            }),
            this.entity.count({
                skip,
                take: para.pageSize,
                where: { delFlag: false }
            })
        ]);
        return new Pagination(items, count, para.pageIndex, para.pageSize)
    }

    async getById(id: number): Promise<T | null> {
        return await this.entity.findUnique({
            where: {
                id,
                delFlag: false
            },
        });
    }

    async create(data: T): Promise<T> {
        return await this.entity.create({
            data,
        });
    }

    async update(id: number, data: Partial<T>): Promise<T> {
        return await this.entity.update({
            where: { id },
            data,
        });
    }

    async delete(id: number): Promise<T> {
        return await this.entity.update({
            where: { id },
            data: { delFlag: true }
        });
    }
}
