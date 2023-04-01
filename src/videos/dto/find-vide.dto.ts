import { IsString, MinLength } from "class-validator";

export class FindVideoDto {
    @IsString()
    @MinLength(1)
    key: string
}