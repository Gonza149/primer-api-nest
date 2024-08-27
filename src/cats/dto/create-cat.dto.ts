import { IsString, MinLength, IsInt, IsPositive, IsOptional } from "class-validator";
import { Breed } from "src/breeds/entities/breed.entity";

export class CreateCatDto {

    @IsString()
    @MinLength(3)
    nombre: string;

    @IsInt()
    @IsPositive()
    edad: number;
    
    @IsString()
    @IsOptional()
    raza: string;
}                                                                       
