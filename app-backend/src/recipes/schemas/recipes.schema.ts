import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Recipe {
  @Prop()
  _id?: mongoose.Types.ObjectId;

  @Prop({ required: true })
  RecipeId: number;

  @Prop({ required: true })
  name: string;

  @Prop()
  AuthorId: number;

  @Prop()
  AuthorName: string;

  @Prop()
  CookTime?: string;

  @Prop()
  PrepTime?: string;

  @Prop()
  TotalTime?: string;

  @Prop()
  Description?: string;

  @Prop()
  Images?: string;

  @Prop()
  RecipeCategory?: string;

  @Prop()
  Keywords?: string[];

  @Prop()
  RecipeIngredientQuantities?: string[];

  @Prop()
  RecipeIngredientParts?: string[];

  @Prop()
  AggregatedRating?: string;

  @Prop()
  ReviewCount?: string;

  @Prop()
  Calories?: number;

  @Prop()
  FatContent?: number;

  @Prop()
  SaturatedFatContent?: number;

  @Prop()
  CholesterolContent?: number;

  @Prop()
  SodiumContent?: number;

  @Prop()
  CarbohydrateContent?: number;

  @Prop()
  FiberContent?: number;

  @Prop()
  SugarContent?: number;

  @Prop()
  ProteinContent?: number;

  @Prop()
  RecipeServings?: number;

  @Prop()
  RecipeYield?: string;

  @Prop()
  RecipeInstructions?: string[];
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
