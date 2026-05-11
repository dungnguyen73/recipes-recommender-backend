import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { filterRecipeDto } from './dto/filter-recipe.dto';
import { updateRecipeDto } from './dto/update-recipe.dto';
import { Recipesv1 } from './schemas/recipesv1.schema';

@Injectable()
export class Recipesv1Service {
  constructor(
    @InjectModel(Recipesv1.name, 'RecipeLens') private recipev1model: Model<Recipesv1>,
  ) {}

  async findAll(): Promise<Recipesv1[]> {
    return await this.recipev1model.find().exec();
  }

  fetchbyId(id: string) {
    return this.recipev1model.findById(id);
  }

  async getFilteredRecipes({ text, category, limit = 30 }: filterRecipeDto) {
    const findProp: any = {};
  
    if (text) {
      const normalizedText = text.trim().replace(/\s+/g, '');
      findProp.$or = [
        { title: { $regex: new RegExp(normalizedText, 'i') } },
        { ingredient: { $regex: new RegExp(normalizedText, 'i') } },
        { instruction: { $regex: new RegExp(normalizedText, 'i') } },
        { equipment: { $regex: new RegExp(normalizedText, 'i') } },
        { recipe_key: { $regex: new RegExp(normalizedText, 'i') } },
      ];
    }
  
    if (category) {
      const normalizedCategory = category.trim().replace(/\s+/g, '');
      findProp.categories = { $regex: new RegExp(normalizedCategory, 'i'), };
    }

    const recipes = await this.recipev1model
      .find(findProp, {
        cook_times: 1,
        title: 1,
        image_url: 1,
        ingredient: 1,
        instruction: 1,
        equipment: 1,
        yield: 1,
        serving_size: 1,
        recipe_key: 1,
        categories: 1,
        nutrition: 1,
      })
      .limit(limit);
  
    return recipes;
  }  

  async updateRecipe(
    id: string,
    updateRecipeDto: updateRecipeDto,
  ): Promise<Recipesv1> {
    const recipe = await this.recipev1model.findByIdAndUpdate(
      id,
      updateRecipeDto,
      { new: true },
    );

    return recipe;
  }

  async updateRecipeImage(id: string, imgsrc: string): Promise<Recipesv1> {
    try {
      const recipe = await this.recipev1model.findById(id);
      recipe.image_url = imgsrc; // Update image_url field
      const updatedRecipe = await recipe.save();

      return updatedRecipe;
    } catch (error) {
      console.error('Error updating recipe image:', error);
      throw error;
    }
  }
}