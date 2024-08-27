import { Module } from '@nestjs/common';
import { CatsModule } from './cats/cats.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BreedsModule } from './breeds/breeds.module';

@Module({
  imports: [
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
    BreedsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
