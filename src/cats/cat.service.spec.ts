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
                useValue: mockCatsService,
                },
                {provide: getRepositoryToken(Breed),
                useValue: mockBreedService,
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

    describe("findAll", () => {
        it("Debería listar lista de gatitis", async () => {
    
            jest.spyOn(catsService,'findAll').mockResolvedValue(mockCats);

            const resultado = await catsService.findAll();

            expect(resultado).toEqual(mockCats);
            expect(catsService.findAll).toHaveBeenCalled();
        });
    });
    
});





