import { PrismaClient } from '@prisma/client';

export type PrismaModels = keyof Omit<PrismaClient, symbol | `$${string}`>;
export type ModelClient<T extends PrismaModels> = PrismaClient[T];
export type NonFunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? never : K }[keyof T];
