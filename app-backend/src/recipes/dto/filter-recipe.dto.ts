import { ApiProperty } from '@nestjs/swagger';
export class filterRecipeDto {
  @ApiProperty({ required: false })
  text?: string;
  @ApiProperty({ required: false })
  category?: string;
  @ApiProperty({ required: false })
  limit?: number;
  @ApiProperty({ required: false })
  page?: number;
  @ApiProperty({ required: false })
  recipe_preferences?: string;
}
