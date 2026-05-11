import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @ApiProperty()
  name?: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;

  @ApiProperty()
  password?: string;
}

export class userPreferenceDto {
  userType: string;
  recipeOptions: string[];
  dietaryRestrictions: string[];
}
