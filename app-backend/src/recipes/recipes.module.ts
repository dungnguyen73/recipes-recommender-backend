import { Module } from '@nestjs/common';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Recipe, RecipeSchema } from './schemas/recipes.schema';

@Module({
  controllers: [RecipesController],
  providers: [RecipesService],
  imports: [
    MongooseModule.forFeature([{ name: Recipe.name, schema: RecipeSchema }], 'RecipeLensDB'),
  ],
})
export class RecipesModule {}
