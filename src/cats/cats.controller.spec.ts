import { CatsController } from "./cats.controller";
import { CatsService } from "./cats.service";
import { Test } from '@nestjs/testing';


describe('CatsController', ()=>{
    let catsController: CatsController;
    let catsService: CatsService;

    beforeEach(async ()=> {
        const moduleRef = await Test.createTestingModule({
            controllers: [CatsController],
            providers: [CatsService],
        }).compile();

        catsService = moduleRef.get<CatsService>(CatsService);
        catsController = moduleRef.get<CatsController>(CatsController);
    });

    describe('findAll', () => {
        it('debe retornar un array de cats', async () => {
            const mockGatos = [{id: 1, nombre: "asdf", edad: 2, raza:{id: 1, nombre: "hola", gatos: null}, borradoEl: null},
            {id: 2, nombre: "asdf", edad: 2, raza:{id: 1, nombre: "hola", gatos: null}, borradoEl: null},
            {id: 3, nombre: "asdf", edad: 2, raza:{id: 1, nombre: "hola", gatos: null}, borradoEl: null}
        ];     

            jest.spyOn(catsService, 'findAll').mockImplementation(() => Promise.resolve(mockGatos));

            const resultado = await catsController.findAll();

            expect(await catsController.findAll()).toBe(resultado);

            expect(catsService.findAll).toHaveBeenCalled();
        });
    });
});