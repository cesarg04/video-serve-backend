import { IsOptional, IsString, MinLength, } from "class-validator";

export class CreateVideoDto {

    @IsString()
    @MinLength(1)
    title: string

    @IsString()
    @IsOptional()
    url?: string

    @IsString()
    @IsOptional()
    descriptions?: string

}
