import { IsBoolean, IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { Role } from "../entities/roles.enum";
import { UserStatus } from "../entities/user-status.enum";

export class CreateUserDto {

    @IsString()
    name:string;

    @IsString()
    @IsOptional()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password:string;

    @IsString()
    @IsEmail()
    email:string

    @IsString()
    @IsOptional()
    photo_url:string;

    @IsString()
    @IsOptional()
    role:Role;

    @IsOptional()
    status?: UserStatus;
}
