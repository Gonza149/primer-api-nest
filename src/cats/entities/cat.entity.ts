import { Breed } from "src/breeds/entities/breed.entity";
import { Column, Entity, DeleteDateColumn, ManyToOne } from "typeorm";



@Entity()
export class Cat {
    @Column({primary: true, generated: true})
    id: number;
    
    @Column()
    nombre: string;

    @Column()
    edad: number;   

    @DeleteDateColumn()
    borradoEl: Date;

    @ManyToOne(()=> Breed, (raza)=>raza.id,{
        eager: true,
    })
    raza: Breed;
}
    