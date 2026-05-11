import { Module } from '@nestjs/common';
import { Recipesv2Controller } from './recipesv2.controller';
import { Recipesv2Service } from './recipesv2.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Recipesv2, Recipev2Schema } from './schemas/recipesv2.schema';

@Module({
  controllers: [Recipesv2Controller],
  providers: [Recipesv2Service],
  imports: [
    MongooseModule.forFeature([{ name: Recipesv2.name, schema: Recipev2Schema }], 'Recipes_DB'),
  ],
})
export class Recipesv2Module {}
