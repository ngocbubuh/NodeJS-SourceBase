import { Pagination, PaginationParameter } from "../../business_objects/pagination";
import { BaseEntity } from "../../entities/base/base.entity";

export interface IGenericRepository<T extends BaseEntity> {
    getAll(para: PaginationParameter): Promise<Pagination<any>>;
    getById(id: number): Promise<T | null>;
    create(data: T): Promise<T>;
    update(id: number, data: Partial<T>): Promise<T>;
    delete(id: number): Promise<T>;
}
