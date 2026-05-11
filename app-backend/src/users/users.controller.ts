import { Controller, Param, Get, Post, Body } from '@nestjs/common';
import { UserService } from './users.service';
import { ApiBearerAuth, ApiBody, ApiProperty, ApiTags } from '@nestjs/swagger';
import { ModifyFavoriteDto } from './dto/ModifyFavorite.dto';
import { RateRecipeDto } from './dto/RateRecipe.dto';
import { userPreferenceDto } from './dto/CreateUser.dto';
import { AddClickDto } from './dto/AddClick.dto';

// Controllers 
@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.fetchUserByID(id);
  }

  @Post(':id/favorites')
  addFavorite(@Body() updateFavoriteDto: ModifyFavoriteDto) {
    return this.userService.addFavorite(
      updateFavoriteDto.id,
      updateFavoriteDto.favorite,
    );
  }

  @Post(':id/unFavorites')
  removeFavorite(@Body() removeFavoriteDto: ModifyFavoriteDto) {
    return this.userService.removeFavorite(
      removeFavoriteDto.id,
      removeFavoriteDto.favorite,
    );
  }

  @Post(':id/ratings')
  rateRecipe(@Body() rateRecipeDto: RateRecipeDto) {
    return this.userService.addRecipeRating(rateRecipeDto);
  }

  @Post(':id/preferences')
  updateUserPreference(@Param('id') id: string, @Body() userPreference: userPreferenceDto) {
    return this.userService.updateUserPreference(id, userPreference);
  }


  @Post(':id/clickNumber')
  addClickNumber(@Body() addClickDto: AddClickDto) {
    const { userId, recipeId } = addClickDto;
    return this.userService.addRecipeClick(userId, recipeId);
  }

  @Get(':id/recipeRating/:recipeId')
  getRecipeRatings(
    @Param('id') userId: string,
    @Param('recipeId') recipeId: number
  ) {
    const numericRecipeId = Number(recipeId);
    return this.userService.getRecipeRatings(userId, numericRecipeId);
  }
  
}