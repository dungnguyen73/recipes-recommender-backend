import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';

export class HybridRecommendationDto {
  @ApiPropertyOptional({
    description: 'The unique identifier of the user (for personalized hybrid recommendation)',
    example: '65f1a2b3c4d5e6f7a8b9c0d1',
  })
  @IsString()
  @IsOptional()
  user_id?: string;

  @ApiProperty({
    description: 'The search query or recipe keywords',
    example: 'beef pasta tomato',
  })
  @IsString()
  @IsNotEmpty()
  query: string;

  @ApiPropertyOptional({
    description: 'Number of recommendations to return',
    example: 10,
    default: 10,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  k?: number;
}
