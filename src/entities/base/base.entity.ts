import { Exclude, Type } from "class-transformer";

export class BaseEntity {
    id?: number;
    @Exclude()
    createBy?: string;
    @Exclude()
    createAt?: Date;
    @Exclude()
    updateBy?: string;
    @Exclude()
    updateAt?: Date;
    @Exclude()
    delFlag?: boolean;
}