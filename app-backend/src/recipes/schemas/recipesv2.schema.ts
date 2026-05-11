import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true, collection: 'recipes_v1.4' })
export class Recipesv2 {
  @Prop()
  _id?: mongoose.Types.ObjectId;

  @Prop({ required: true })
  RecipeId: number;

  @Prop({ required: true })
  title: string;

  @Prop()
  image_url: string;

  @Prop()
  cook_times: string;

  @Prop()
  ingredient: string;

  @Prop()
  instruction: string;

  @Prop()
  yield: string;

  @Prop()
  serving_size: string;

  @Prop()
  recipe_key: string;

  @Prop()
  categories: string;

  @Prop({ type: Object })
  nutrition: string;

  @Prop()
  rating: number;

  @Prop()
  author: string;

  @Prop()
  description: string;

  @Prop()
  preferences: string;
}

export const Recipev2Schema = SchemaFactory.createForClass(Recipesv2);