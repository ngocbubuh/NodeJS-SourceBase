import { Exclude, Type } from "class-transformer";

export class BaseEntity {
    id?: number;
    @Exclude()
    createBy?: string | null;
    @Exclude()
    createAt?: Date;
    @Exclude()
    updateBy?: string | null;
    @Exclude()
    updateAt?: Date;
    @Exclude()
    delFlag?: boolean;
}