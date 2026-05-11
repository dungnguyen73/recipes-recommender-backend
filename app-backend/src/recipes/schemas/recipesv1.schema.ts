import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ versionKey: false, collection: 'recipesv1' })
export class Recipesv1 {
  @Prop()
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  image_url: string;

  @Prop({ type: Object })
  cook_times: {
    prep_time: string;
    cook_time: string;
    total_time: string;
    cooling_time: string;
  };

  @Prop()
  ingredient: Array<string>;

  @Prop()
  instruction: Array<string>;

  @Prop()
  equipment: Array<string>;

  @Prop()
  yield: string;

  @Prop()
  serving_size: string;

  @Prop()
  recipe_key: Array<string>;

  @Prop()
  categories: Array<string>;

  @Prop({ type: Object })
  nutrition: {
    serving: string;
    calories: string;
    carbohydrates: string;
    protein: string;
    fat: string;
    saturatedFat: string;
    cholesterol: string;
    sodium: string;
    fiber: string;
    sugar: string;
  };
}

export const Recipev1Schema = SchemaFactory.createForClass(Recipesv1);