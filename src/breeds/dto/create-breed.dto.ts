import { IsString, MinLength } from "class-validator";

export class CreateBreedDto {

    @IsString()
    @MinLength(3)
    nombre: string;
}
