import { IsMongoId, IsNotEmpty, IsOptional, IsString, IsNumber } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class RateRecipeDto {
    @IsMongoId()
    @IsNotEmpty()
    @ApiProperty()
    userId: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    recipeId: number;

    @IsNumber()
    @ApiProperty()
    rating: number;

    @IsOptional()
    @IsString()
    @ApiProperty()
    comment?: string;

    @IsOptional()
    @ApiProperty()
    timestamp?: Date;
}