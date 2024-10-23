import { Test, TestingModule } from '@nestjs/testing';
import { BreedsService } from './breeds.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Breed } from './entities/breed.entity';
import { Repository } from 'typeorm';
import { CreateBreedDto } from './dto/create-breed.dto';
import { UpdateBreedDto } from './dto/update-breed.dto';

describe('BreedsService', () => {
    let service: BreedsService;
    let repository: Repository<Breed>;
  
    const mockBreedRepository = {
      save: jest.fn(),
      find: jest.fn(),
      findOneBy: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
    };
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          BreedsService,
          {
            provide: getRepositoryToken(Breed),
            useValue: mockBreedRepository,
          },
        ],
      }).compile();
  
      service = module.get<BreedsService>(BreedsService);
      repository = module.get<Repository<Breed>>(getRepositoryToken(Breed));
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('El servicio deberia estar definido', () => {
      expect(service).toBeDefined();
    });

    it('Deberia crear una raza nueva', async () =>{
      const createBreedDto: CreateBreedDto = { nombre: 'Egipcio' };
      const savedBreed = { id: 1, ...createBreedDto };

      mockBreedRepository.save.mockResolvedValue(savedBreed);

      expect(await service.create(createBreedDto)).toEqual(savedBreed);
      expect(mockBreedRepository.save).toHaveBeenCalledWith(createBreedDto);

    });

    it('Debería devolver una lista de razas', async () => {
        const razas = [{ id: 1, nombre: 'Siames' }, { id: 2, nombre: 'Singapura' }];
        mockBreedRepository.find.mockResolvedValue(razas);
  
        expect(await service.findAll()).toEqual(razas);
        expect(mockBreedRepository.find).toHaveBeenCalled();

    });


    it('Deberia devolver una raza especifica segun el id',async () => {
      const raza = { id: 1, nombre: 'Labrador' };
      mockBreedRepository.findOneBy.mockResolvedValue(raza);

      expect(await service.findOne(1)).toEqual(raza);
      expect(mockBreedRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });

    });

    it('Deberia devolver un valor nulo si no encuentra una raza segun id', async ()=>{
      mockBreedRepository.findOneBy.mockResolvedValue(null);

      expect(await service.findOne(47)).toBeNull();
      expect(mockBreedRepository.findOneBy).toHaveBeenCalledWith({ id: 47 });
    });

    it('Deberia borrar la raza segun id y que se vea afectada', async () =>{

      mockBreedRepository.softDelete.mockResolvedValue({ affected: 1 });

      expect(await service.remove(1)).toEqual({ affected: 1 });
      expect(mockBreedRepository.softDelete).toHaveBeenCalledWith({ id: 1 });
    });


});
