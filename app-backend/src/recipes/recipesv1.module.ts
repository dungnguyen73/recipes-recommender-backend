import { Module } from '@nestjs/common';
import { Recipesv1Controller } from './recipesv1.controller';
import { Recipesv1Service } from './recipesv1.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Recipesv1, Recipev1Schema } from './schemas/recipesv1.schema';

@Module({
  controllers: [Recipesv1Controller],
  providers: [Recipesv1Service],
  imports: [
    MongooseModule.forFeature([{ name: Recipesv1.name, schema: Recipev1Schema }], 'RecipeLens'),
  ],
})
export class Recipesv1Module {}
