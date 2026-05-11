import { IsMongoId, IsNotEmpty, IsNumber } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class AddClickDto {
    @IsMongoId()
    @IsNotEmpty()
    @ApiProperty()
    userId: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    recipeId: number;
}