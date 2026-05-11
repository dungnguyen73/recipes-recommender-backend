import { Controller, Get, Param, Query, NotFoundException, Patch, Put, Body } from '@nestjs/common';
import mongoose from 'mongoose';
import { filterRecipeDto } from './dto/filter-recipe.dto';
import { updateRecipeDto } from './dto/update-recipe.dto';
import { Recipesv1Service } from './recipesv1.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Recipes')
@Controller('v1/recipes')
export class Recipesv1Controller {
  constructor(private recipesv1Service: Recipesv1Service) {}

  @Get('/')
  async getRecipes(@Query() filterDto: filterRecipeDto) {
    if (!filterDto.text && !filterDto.category && !filterDto.category) {
      return await this.recipesv1Service.findAll();
    }

    const filteredRecipes = await this.recipesv1Service.getFilteredRecipes(filterDto);
    return filteredRecipes;
  }

  @Get('/:id')
  async getRecipeById(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      console.log('invalid');
    }
    const user = await this.recipesv1Service.fetchbyId(id);
    if (!user) {
      console.log('Not found');
    }
    return user;
  }

  @Put('/:id')
  async updateRecipe(
    @Param('id') id: string,
    @Body() updateRecipeDto: updateRecipeDto,
  ) {
    const recipe = await this.recipesv1Service.updateRecipe(id, updateRecipeDto);
    if (!recipe) throw new NotFoundException('Recipe does not exist');
    return recipe;
  }

  @Patch('/:id')
  async updateRecipeImageSrc(@Param('id') id: string, @Body() img: string) {
    const recipe = await this.recipesv1Service.updateRecipeImage(id, img);
    if (!recipe) throw new NotFoundException('Fail in update Recipe Image');
    return recipe;
  }
}