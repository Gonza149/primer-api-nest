import { IsString, MinLength, IsInt, IsPositive, IsOptional } from "class-validator";
import { Breed } from "../../breeds/entities/breed.entity";

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
