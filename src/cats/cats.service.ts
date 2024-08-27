import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cat } from "./entities/cat.entity";
import { Repository} from "typeorm";
import { Breed } from 'src/breeds/entities/breed.entity';

@Injectable()
export class CatsService {

  constructor(

    @InjectRepository(Cat)
    private readonly catRepository: Repository<Cat>,

    @InjectRepository(Breed)
    private readonly breedRepository: Repository<Breed>,
    ){}

  async create(createCatDto: CreateCatDto) {
    
    const raza = await this.breedRepository.findOneBy({nombre: createCatDto.raza});

    if (!raza){
      throw new BadRequestException("Raza no encontrada");
    }

    return await this.catRepository.save({...createCatDto,raza});
  }

  async findAll() {
    return await this.catRepository.find();
  }

  async findOne(id: number) {
    return await this.catRepository.findOneBy({ id });                                    
  }

  async update(id: number, updateCatDto: UpdateCatDto) {
    return await this.catRepository.update(id, updateCatDto);
  }

  async remove(id: number) {
    return await this.catRepository.softDelete({ id });
  }
}
