import { Gender, UserRole } from "../utils/enums/enums";
import { BaseEntity } from "./base/base.entity";
import { IsString, MinLength, MaxLength, IsNotEmpty, Matches, IsDefined, ValidateIf, Equals, IsNumber, IsEmail, IsPhoneNumber, IsEnum } from "class-validator";
import { Exclude, Expose, Transform } from "class-transformer";
import exp from "node:constants";

export class User extends BaseEntity {
    @Expose()
    firstName!: string;
    @Expose()
    lastName!: string;
    @Expose()
    email!: string;
    @Expose()
    emailVerified?: boolean;
    @Expose()
    phone!: string;
    //phoneVerified: string; //Does not know how to do this
    @Expose()
    age!: number;
    @Expose()
    gender!: Gender;
    @Expose()
    avatar?: string; //Contain link to the image (Firebase, ...)
    @Expose()
    role!: UserRole; //Set fixed role instead of having a Role table
    @Expose()
    password!: string;
}

//DAO
export class BaseUser {
    @Expose()
    id?: number;
    @IsString()
    @Expose()
    firstName!: string;
    @IsString()
    @Expose()
    lastName!: string;
    @Expose()
    @IsEmail()
    email!: string;
    @Expose()
    @IsPhoneNumber()
    phone!: string;
    @Expose()
    @IsNumber()
    age!: number;
    @Expose()
    @IsEnum(Gender)
    gender!: Gender;
    @Expose()
    @IsString()
    avatar?: string; //Contain link to the image (Firebase, ...)
    @Expose()
    @IsEnum(UserRole)
    role!: UserRole; //Set fixed role instead of having a Role table
}

//Business Object
export interface UserEmail {
    email: string
}
export class CreateUserDTO {
    @IsString()
    @Expose()
    firstName!: string;
    @IsString()
    @Expose()
    lastName!: string;
    @Expose()
    @IsEmail()
    email!: string;
    @Expose()
    @IsPhoneNumber()
    phone!: string;
    @Expose()
    @IsNumber()
    age!: number;
    @Expose()
    @IsEnum(Gender)
    gender!: Gender;
    @Expose()
    @IsString()
    avatar?: string; //Contain link to the image (Firebase, ...)
    @Expose()
    @IsEnum(UserRole)
    role!: UserRole; //Set fixed role instead of having a Role table
    @IsString()
    @MinLength(7, { message: "Password must be at least 7 characters long" })
    password!: string;
    @IsString()
    @MinLength(7, { message: "Password must be at least 7 characters long" })
    confirmPassword?: string;
}

export class AuthRequest {
    @IsEmail()
    email!: string;
    @IsString()
    @MinLength(7, { message: "Password must be at least 7 characters long" })
    password!: string;
}

export class RefreshTokenRequest {
    refreshToken!: string;
}

export class AuthResponse {
    accessToken!: string;
    refreshToken!: string;
}

export class UpdateUserDTO {
    @Expose()
    firstName!: string;
    @Expose()
    lastName!: string;
    @Expose()
    @IsPhoneNumber()
    phone!: string;
    @Expose()
    @IsNumber()
    age!: number;
    @Expose()
    gender!: Gender;
    @Expose()
    avatar?: string; //Contain link to the image (Firebase, ...)
}