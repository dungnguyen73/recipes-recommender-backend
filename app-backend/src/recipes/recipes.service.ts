import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { filterRecipeDto } from './dto/filter-recipe.dto';
import { updateRecipeDto } from './dto/update-recipe.dto';
import { Recipe } from './schemas/recipes.schema';

@Injectable()
export class RecipesService {
  constructor(
    @InjectModel(Recipe.name, 'RecipeLensDB') private recipemodel: Model<Recipe>,
  ) {}

  async findAll(): Promise<Recipe[]> {
    return await this.recipemodel.find().exec();
  }

  fetchbyId(id: string) {
    return this.recipemodel.findById(id);
  }

  async findRecipeById(recipeId: number): Promise<Recipe | null> {
    try {
      const recipe = await this.recipemodel
        .findOne({ RecipeId: recipeId })
        .exec();
      return recipe;
    } catch (error) {
      console.error('Error fetching recipe by ID:', error);
      return null;
    }
  }

  async findRecipeByCategory(category: string): Promise<Recipe[] | null> {
    try {
      const recipes = await this.recipemodel
        .find({ RecipeCategory: category })
        .exec();
      return recipes || null;
    } catch (error) {
      console.error('Error fetching recipe by ID:', error);
      return null;
    }
  }

  async getFilteredRecipes({ text, category, limit = 30 }: filterRecipeDto) {
    const categoryList = category?.split(',');
    const findProp: any = text
      ? {
          $and: [
            categoryList?.length > 0
              ? {
                  RecipeCategory: { $in: categoryList },
                }
              : {},
            {
              $text: { $search: text },
            },
          ],
        }
      : {
          $and: [
            categoryList?.length > 0
              ? {
                  RecipeCategory: { $in: categoryList },
                }
              : {},
          ],
        };

    const recipes = await this.recipemodel.find(findProp).limit(limit);
    return recipes;
  }

  async updateRecipe(
    id: string,
    updateRecipeDto: updateRecipeDto,
  ): Promise<Recipe> {
    const recipe = await this.recipemodel.findByIdAndUpdate(
      id,
      updateRecipeDto,
      { new: true },
    );

    return recipe;
  }

  async updateRecipeImage(id: string, imgsrc: string): Promise<Recipe> {
    try {
      const recipe = await this.recipemodel.findById(id);
      recipe.Images = imgsrc;
      const updatedRecipe = await recipe.save();

      return updatedRecipe;
    } catch (error) {
      console.error('Error updating recipe image:', error);
      throw error;
    }
  }
}
