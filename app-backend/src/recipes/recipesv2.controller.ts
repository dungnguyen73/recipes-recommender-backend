import { Controller, Get, Param, Query, NotFoundException, Patch, Put, Body } from '@nestjs/common';
import mongoose from 'mongoose';
import { filterRecipeDto } from './dto/filter-recipe.dto';
import { updateRecipeDto } from './dto/update-recipe.dto';
import { Recipesv2Service } from './recipesv2.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Recipes')
@Controller('v2/recipes')
export class Recipesv2Controller {
  constructor(private recipesv2Service: Recipesv2Service) {}

  @Get('/')
  async getRecipes(@Query() filterDto: filterRecipeDto) {
    const filteredRecipes = await this.recipesv2Service.getFilteredRecipes(filterDto);
    return filteredRecipes;
  }

  @Get('/objectID/:_id')
  async getRecipeById(@Param('_id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      return 'ID is invalid';
    }
    const recipe = await this.recipesv2Service.fetchbyId(id);
    if (!recipe) {
      return 'Not found';
    }
    return recipe;
  }

  @Get('/recipeID/:id')
  async findRecipeById(@Param('id') id: number) {
    const recipe = await this.recipesv2Service.findRecipeById(id);

    if (!recipe) throw new NotFoundException('Recipe does not exist!');
    return recipe;
  }


  @Put('/:id')
  async updateRecipe(
    @Param('id') id: string,
    @Body() updateRecipeDto: updateRecipeDto,
  ) {
    const recipe = await this.recipesv2Service.updateRecipe(id, updateRecipeDto);
    if (!recipe) throw new NotFoundException('Recipe does not exist');
    return recipe;
  }

  @Patch('/:id')
  async updateRecipeImageSrc(@Param('id') id: string, @Body() img: string) {
    const recipe = await this.recipesv2Service.updateRecipeImage(id, img);
    if (!recipe) throw new NotFoundException('Fail in update Recipe Image');
    return recipe;
  }
}