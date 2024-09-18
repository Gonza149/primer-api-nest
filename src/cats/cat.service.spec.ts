import { CatsService } from "./cats.service";
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Cat } from "./entities/cat.entity";
import { Breed } from '../breeds/entities/breed.entity';
import { DataSource } from "typeorm";
import { CatsModule } from "./cats.module";

describe('catsService', ()=>{
    let catsService: CatsService;

    beforeEach(async ()=> {
        const module: TestingModule = await Test.createTestingModule({
            imports: [TypeOrmModule.forFeature([Cat, Breed]),
                    CatsModule, DataSource],
            providers: [
                CatsService,
                {provide: Cat,
                    useValue: {},
                }],
        }).compile();

        catsService = module.get<CatsService>(CatsService);
    
    });

    it("Servicios de Cat", () => {
        expect(catsService).toBeDefined();
    });

});

