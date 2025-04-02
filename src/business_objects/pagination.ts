import { Expose, Type } from "class-transformer";

export class Pagination<T> {
    @Expose() public currentPage: number;
    @Expose() public totalPages: number;
    @Expose() public pageSize: number;
    @Expose() public totalCount: number;
    @Expose() public hasPrevious: boolean;
    @Expose() public hasNext: boolean;

    @Expose()
    @Type(() => Object) // This will be transformed dynamically
    public items: T[];

    constructor(items: T[], count: number, pageNumber: number, pageSize: number) {
        this.totalCount = count;
        this.pageSize = pageSize;
        this.currentPage = pageNumber;
        this.totalPages = Math.ceil(count / pageSize);
        this.hasPrevious = pageNumber > 1;
        this.hasNext = pageNumber < this.totalPages;
        this.items = items;
    }
}

export class PaginationParameter {
    private static readonly maxPageSize = 50; // Equivalent to C#'s const
    public pageIndex: number = 1;
    private _pageSize: number = 10;

    constructor(pageIndex?: number, pageSize?: number) {
        if (pageIndex !== undefined) {
            this.pageIndex = pageIndex;
        }
        if (pageSize !== undefined) {
            this.pageSize = pageSize; // Setter will handle maxPageSize validation
        }
    }

    public get pageSize(): number {
        return this._pageSize;
    }

    public set pageSize(value: number) {
        this._pageSize = value > PaginationParameter.maxPageSize ? PaginationParameter.maxPageSize : value;
    }
}