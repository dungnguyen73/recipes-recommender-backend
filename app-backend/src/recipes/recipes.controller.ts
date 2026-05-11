import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
  Patch,
  Put,
  Body,
} from '@nestjs/common';
import mongoose from 'mongoose';
import { filterRecipeDto } from './dto/filter-recipe.dto';
import { updateRecipeDto } from './dto/update-recipe.dto';
import { RecipesService } from './recipes.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Recipes')
@Controller('recipes')
export class RecipesController {
  constructor(private recipesService: RecipesService) {}

  @Get('/:id')
  async findRecipeById(@Param('id') id: number) {
    const recipe = await this.recipesService.findRecipeById(id);

    if (!recipe) throw new NotFoundException('Recipe does not exist!');
    else {
      console.log('HELLO');
    }
    return recipe;
  }

  @Get('/')
  async getRecipes(@Query() filterDto: filterRecipeDto) {
    if (!filterDto.text && !filterDto.category && !filterDto.category) {
      return await this.recipesService.findAll();
    }

    const filteredRecipes =
      await this.recipesService.getFilteredRecipes(filterDto);
    return filteredRecipes;
  }
  @Get('objectId/:id')
  async getRecipeById(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      console.log('invalid');
    }
    const user = await this.recipesService.fetchbyId(id);
    if (!user) {
      console.log('Not found');
    }
    return user;
  }

  @Put(':id')
  async updateRecipe(
    @Param('id') id: string,
    @Body() updateRecipeDto: updateRecipeDto,
  ) {
    const recipe = await this.recipesService.updateRecipe(id, updateRecipeDto);
    if (!recipe) throw new NotFoundException('Recipe does not exist');
    return recipe;
  }

  @Patch(':id')
  async updateRecipeImageSrc(@Param('id') id: string, @Body() img: string) {
    const recipe = await this.recipesService.updateRecipeImage(id, img);
    if (!recipe) throw new NotFoundException('Fail in update Recipe Image');
    return recipe;
  }
}
