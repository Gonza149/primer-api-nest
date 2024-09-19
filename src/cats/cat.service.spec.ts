import { CatsService } from "./cats.service";
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from "@nestjs/typeorm";
import { Cat } from "./entities/cat.entity";
import { Breed } from '../breeds/entities/breed.entity';
import { Repository } from "typeorm";
import { CatsController } from "./cats.controller";



const mockCatsService = {};
const mockBreedService = {};

const mockCats = [
    {
      id: 1,
      nombre: "Albierto",
      edad: 12,
      borradoEl: null,
      raza: {
        id: 1,
        nombre: "Siamés",
        gatos: null
      }
    },
    {
      id: 2,
      nombre: "Miaufasa",
      edad: 5,
      borradoEl: null,
      raza: {
        id: 2,
        nombre: "Bengala",
        gatos: null
      }
    },
    {
      id: 3,
      nombre: "Felix",
      edad: 7,
      borradoEl: null,
      raza: {
        id: 3,
        nombre: "Persa",
        gatos: null
      }
    }
  ];

describe('catsService', ()=>{
    let catsService: CatsService;
    let catRepository: Repository<Cat>;
    let breedRepository: Repository<Breed>;

    beforeEach(async ()=> {
        const module: TestingModule = await Test.createTestingModule({

            providers: [
                CatsService,
                {provide: getRepositoryToken(Cat),
                useValue: {
                  mockCatsService,
                  findOneBy: jest.fn(),
                  save: jest.fn(),
                },
                },
                {provide: getRepositoryToken(Breed),
                useValue: {
                  mockBreedService,
                  findOneBy: jest.fn(),
                },
                },
            ],
        }).compile();

        catsService = module.get<CatsService>(CatsService);
        catRepository = module.get<Repository<Cat>>(getRepositoryToken(Cat));
        breedRepository = module.get<Repository<Breed>>(getRepositoryToken(Breed));

    });

    it("Servicios de Cat", () => {
        expect(catsService).toBeDefined();
    });


    it("Debería listar lista de gatitis", async () => {
    
        jest.spyOn(catsService,'findAll').mockResolvedValue(mockCats);

        const resultado = await catsService.findAll();

        expect(resultado).toEqual(mockCats);
        expect(catsService.findAll).toHaveBeenCalled();
    });
    

    it("Debería mostrar solamente un objeto a partir del Id dado", async () => {

      const mockGato = {
        id: 2,
        nombre: "Miaufasa",
        edad: 5,
        borradoEl: null,
        raza: {
          id: 2,
          nombre: "Bengala",
          gatos: null
        }
      };

      jest.spyOn(catRepository,"findOneBy").mockResolvedValue(mockGato);

      const resultado = await catsService.findOne(2);

      expect(resultado).toEqual(mockGato);
      expect(catRepository.findOneBy).toHaveBeenCalledWith({id: 2});
    });

    it(" El resultado debería ser null cuando no encuentra el gato", async () => {
        
      jest.spyOn(catRepository, "findOneBy").mockResolvedValue(null);

      const resultado = await catsService.findOne(3);

      expect(resultado).toBeNull();
      expect(catRepository.findOneBy).toHaveBeenCalledWith({id: 3});
    });

    it("Debería crear un gato con una raza asociada y guardarlo", async () => {
      const createCatDto = {
        nombre: "Teodoro",
        edad: 8,
        raza: "Egipcio",
      };

      const mockRaza = {
        id: 1,
        nombre: "Egipcio",
        gatos: null,
      };

      const mockGato = {...createCatDto, 
        id: 1, 
        raza: mockRaza,
        borradoEl: null,
      };

      jest.spyOn(breedRepository, "findOneBy").mockResolvedValue(mockRaza);
      jest.spyOn(catRepository, "save").mockResolvedValue(mockGato);

      const resultado = await catsService.create(createCatDto);

      expect(resultado).toEqual(mockGato);
      expect(breedRepository.findOneBy).toHaveBeenCalledWith({nombre: "Egipcio"});
      expect(catRepository.save).toHaveBeenCalledWith({...createCatDto, raza: mockRaza});

    });
});





