import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsOptional, IsPositive, IsString, MinLength } from 'class-validator';
import { Breed } from '../../breeds/entities/breed.entity';
import { CreateCatDto } from './create-cat.dto';

export class UpdateCatDto {  
    @IsString()
    @MinLength(3)
    @IsOptional()
    nombre?: string;

    @IsInt()
    @IsPositive()
    @IsOptional()
    edad?: number;
    
    @IsOptional()
    raza?: Breed;
 }
