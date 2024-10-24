import { CatsService } from "./cats.service";
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { Cat } from "./entities/cat.entity";
import { Breed } from '../breeds/entities/breed.entity';
import { Repository } from "typeorm";
import { CatsController } from "./cats.controller";
import { CatsModule } from "./cats.module";
import { BreedsModule } from "../breeds/breeds.module";
import { BreedsService } from "../breeds/breeds.service";


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


describe('Integración entre Cat y Breed', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [
        CatsModule, 
        BreedsModule,
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: 'gonzalo',
          password: 'root',
          database: 'db_crud',
          autoLoadEntities: true,
          synchronize: true,
        }),
        CatsModule,
        BreedsModule
      ],
    }).compile();
  });

  it('Debería crear un gato junto con la raza', async () => {
    const catsService = app.get(CatsService);
    const breedsService = app.get(BreedsService);

    const breed = await breedsService.create({ 
      nombre: 'Siames' 
    });
    
    const gato = await catsService.create({
      nombre: 'Felix', 
      raza: 'Siames', 
      edad: 2
    });

    expect(gato).toBeDefined();
    expect(gato.raza.nombre).toEqual('Siames');
  });


  it('Debería actualizar los datos del gatito', async () => {
    const catsService = app.get(CatsService);
    const breedsService = app.get(BreedsService);
  
    const raza = await breedsService.create({ 
      nombre: 'Siames' 
    });
  
    const gato = await catsService.create({
      nombre: 'Felix',
      raza: 'Siames',
      edad: 2,
    });
  
    expect(gato).toBeDefined();
    expect(gato.raza.nombre).toEqual('Siames');
  
    const gatoActualizado = { 
      nombre: 'Sancho Panza', 
      edad: 10 };
      
    await catsService.update(gato.id, gatoActualizado);
  
    const datosGatoActualizado = await catsService.findOne(gato.id);
  
    expect(datosGatoActualizado).toBeDefined();
    expect(datosGatoActualizado.nombre).toEqual('Sancho Panza');
    expect(datosGatoActualizado.edad).toEqual(10);
  });
  
  it('Debería borrar un gato y verificar que no existe', async () => {
    const catsService = app.get(CatsService);
    const breedsService = app.get(BreedsService);

    const breed = await breedsService.create({ 
      nombre: 'Siames' 
    });
  
    const gato = await catsService.create({
      nombre: 'Felix',
      raza: 'Siames',
      edad: 2,
    });
  
    expect(gato).toBeDefined();
    
    await catsService.remove(gato.id);
  
    const gatoBorrado = await catsService.findOne(gato.id);
  
    expect(gatoBorrado).toBeNull();
  });
  
  it('Debería listar todos los gatos', async () => {
    const catsService = app.get(CatsService);
    const breedsService = app.get(BreedsService);

    const raza1 = await breedsService.create({ 
      nombre: 'Montes' 
    });
  
    const raza2 = await breedsService.create({ 
      nombre: 'Egipcio' 
    });

    await catsService.create({
      nombre: 'Matias Rodriguez',
      raza: 'Montes',
      edad: 12,
    });

    await catsService.create({
      nombre: 'Salchicha',
      raza: 'Egipcio',
      edad: 9,
    });
    await catsService.create({
      nombre: 'Preguntale',
      raza: 'Egipcio',
      edad: 1,
    });
  
    const gatos = await catsService.findAll();
  
    expect(gatos).toBeDefined();
    expect(gatos.length).toBeGreaterThan(0);
    expect(gatos).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ nombre: 'Matias Rodriguez' }),
        expect.objectContaining({ nombre: 'Salchicha' }),
        expect.objectContaining({ nombre: 'Preguntale' }),
      ])
    );
  });
  
  it('Debería buscar y encontrar un gato por id y verificar la relación con la raza', async () => {
    const catsService = app.get(CatsService);
    const breedsService = app.get(BreedsService);
    
    const raza1 = await breedsService.create({ 
      nombre: 'Persa' 
    });
  
    const gato = await catsService.create({
      nombre: 'Manchita',
      raza: 'Persa',
      edad: 8,  
    });
  
    const gatoEncontrado = await catsService.findOne(gato.id);
  
    expect(gatoEncontrado).toBeDefined();
    expect(gatoEncontrado.raza.nombre).toEqual(raza1.nombre);
    expect(gatoEncontrado.nombre).toEqual(gato.nombre);
    expect(gatoEncontrado.edad).toEqual(gato.edad);
  });
  

  afterAll(async () => {
    await app.close();
  });

});






