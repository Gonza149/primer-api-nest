import { CatsService } from "./cats.service";
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from "@nestjs/typeorm";
import { Cat } from "./entities/cat.entity";
import { Breed } from '../breeds/entities/breed.entity';
import { DataSource, Repository } from "typeorm";



const mockCatsService = {};
const mockBreedService = {};

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

});

