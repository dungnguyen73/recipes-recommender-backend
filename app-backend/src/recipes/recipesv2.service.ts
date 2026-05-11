import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { filterRecipeDto } from './dto/filter-recipe.dto';
import { updateRecipeDto } from './dto/update-recipe.dto';
import { Recipesv2 } from './schemas/recipesv2.schema';

@Injectable()
export class Recipesv2Service {
  constructor(
    @InjectModel(Recipesv2.name, 'Recipes_DB') private recipev2model: Model<Recipesv2>,
  ) {}

  async findAll(): Promise<Recipesv2[]> {
    return await this.recipev2model.find().exec();
  }

  fetchbyId(id: string) {
    return this.recipev2model.findOne({ _id: new mongoose.Types.ObjectId(id) });
  }

  async findRecipeById(recipeId: number): Promise<Recipesv2 | null> {
    try {
      const recipe = await this.recipev2model.findOne({ RecipeId: recipeId });
      return recipe;
    } catch (error) {
      console.error('Error fetching recipe by ID:', error);
      return null;
    }
  }

  async getFilteredRecipes({ text = '', category = '', limit = 30, page = 1, recipe_preferences = '' }: filterRecipeDto) {
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
      findProp.categories = { $regex: new RegExp(normalizedCategory, 'i') };
    }

    if (recipe_preferences && recipe_preferences.length > 0) {
      findProp.preferences = { $in: recipe_preferences.split(',') }; 
    }

    const recipes = await this.recipev2model
      .find(findProp, {
        _id: 1,
        RecipeId: 1,
        title: 1,
        image_url: 1,
        cook_times: 1,
        ingredients: 1,
        instruction: 1,
        yield: 1,
        serving_size: 1,
        recipe_key: 1,
        categories: 1,
        nutrition: 1,
        rating: 1,
        author: 1,
        description: 1,
        preferences: 1,
      })
      .skip((page - 1) * limit)
      .limit(limit);
  
    return recipes;
  }  

  async updateRecipe(
    id: string,
    updateRecipeDto: updateRecipeDto,
  ): Promise<Recipesv2> {
    const recipe = await this.recipev2model.findByIdAndUpdate(
      id,
      updateRecipeDto,
      { new: true },
    );

    return recipe;
  }

  async updateRecipeImage(id: string, imgsrc: string): Promise<Recipesv2> {
    try {
      const recipe = await this.recipev2model.findById(id);
      recipe.image_url = imgsrc; // Update image_url field
      const updatedRecipe = await recipe.save();

      return updatedRecipe;
    } catch (error) {
      console.error('Error updating recipe image:', error);
      throw error;
    }
  }
}