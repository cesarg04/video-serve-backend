import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateAuthDto {

    @IsString()
    @MinLength(5)
    name: string

    @IsString()
    @MinLength(8)
    username: string

    @IsEmail()
    email: string

    @IsString()
    @MinLength(8)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string

}