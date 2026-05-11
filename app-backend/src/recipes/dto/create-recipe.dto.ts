export class CreateRecipeDto {
  //@Prop()
  _id?: string;

  //@Prop({ required: true })
  RecipeId?: number;

  //@Prop({ required: true })
  Name: string;

  //@Prop()
  AuthorId?: number;

  //@Prop()
  AuthorName?: string;

  //@Prop()
  CookTime?: string;

  //@Prop()
  PrepTime?: string;

  //@Prop()
  TotalTime?: string;

  //@Prop()
  Description?: string;

  //@Prop()
  Images?: string;

  //@Prop()
  RecipeCategory?: string;

  //@Prop()
  Keywords?: string[];

  //@Prop()
  RecipeIngredientQuantities?: string[];

  //@Prop()
  RecipeIngredientParts?: string[];

  //@Prop()
  AggregatedRating?: string;

  //@Prop()
  ReviewCount?: string;

  //@Prop()
  Calories?: number;

  //@Prop()
  FatContent?: number;

  //@Prop()
  SaturatedFatContent?: number;

  //@Prop()
  CholesterolContent?: number;

  //@Prop()
  SodiumContent?: number;

  //@Prop()
  CarbohydrateContent?: number;

  //@Prop()
  FiberContent?: number;

  //@Prop()
  SugarContent?: number;

  //@Prop()
  ProteinContent?: number;

  //@Prop()
  RecipeServings?: number;

  //@Prop()
  RecipeYield?: string;

  //@Prop()
  RecipeInstructions?: string[];
}
