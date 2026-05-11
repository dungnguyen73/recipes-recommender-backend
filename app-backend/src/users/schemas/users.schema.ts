import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

class RecipeRating {
  @Prop({ type: Number, ref: 'Recipe', required: true })
  recipeId: number;

  @Prop({ type: Number, required: true })
  rating: number;

  @Prop({ type: String, required: false })
  comment?: string;

  @Prop({ type: Number, required: false })
  clickNumber?: number;

  @Prop({ type: Date, default: Date.now })
  timestamp: Date;
}

@Schema({ versionKey: false })
export class User {
  _id: mongoose.Types.ObjectId;

  @Prop({ required: false })
  name: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: false })
  password?: string;

  @Prop({ required: false })
  favorite?: number[];

  @Prop({ type: [RecipeRating], default: [] })
  recipeRatings?: RecipeRating[];

  @Prop({ type: Boolean, default: false }) 
  isSurveyed?: boolean;

  @Prop({ type: String, required: false }) 
  user_type?: string;

  @Prop({ type: [String], default: [] }) 
  recipe_preference?: string[];

  @Prop({ type: [String], default: [] }) 
  dietary_restrictions?: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
