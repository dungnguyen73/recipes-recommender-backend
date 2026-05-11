import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/schemas/users.schema';
import { Model } from 'mongoose';
import { CreateUserDto, userPreferenceDto } from './dto/CreateUser.dto';
import mongoose from 'mongoose';
import { RateRecipeDto } from './dto/RateRecipe.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name, 'RecipeLensDB') private userModel: Model<User>) {}

  create(createUserDto: CreateUserDto) {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll() {
    const users = await this.userModel.find();
    let retUsers = [];
    for (let i = 0; i < users.length; i++) {
      const { password, ...retUser } = users[i].toObject();
      password;
      retUsers = [...retUsers, retUser];
    }
    return retUsers;
  }

  async fetchUserByID(id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const user = await this.userModel.findById(id);
    const { password, ...retUser } = user.toObject();
    password;
    return retUser;
  }

  async findOne(email: string) {
    return await this.userModel.findOne({ email });
  }

  async addFavorite(id: string, favorites: number[]) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const user = await this.userModel.findById(id);
    for (let i = 0; i < favorites.length; i++) {
      if (user.favorite.includes(favorites[i])) {
        throw new HttpException(
          'Favorite already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      user.favorite.push(favorites[i]);
    }
    return user.save();
  }

  async removeFavorite(id: string, favorites: number[]) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const user = await this.userModel.findById(id);
    for (let i = 0; i < favorites.length; i++) {
      if (!user.favorite.includes(favorites[i])) {
        throw new HttpException('Favorite not found', HttpStatus.BAD_REQUEST);
      }
      user.favorite = user.favorite.filter(
        (favorite) => favorite !== favorites[i],
      );
    }
    return user.save();
  }

  async addRecipeRating(rateRecipeDto: RateRecipeDto) {
    const { userId, recipeId, rating, comment } = rateRecipeDto;
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const recipeRating = user.recipeRatings.find(
      (rating) => rating.recipeId === recipeId,
    );

    if (recipeRating) {
      recipeRating.rating = rating;
      recipeRating.comment = comment;
      recipeRating.clickNumber = recipeRating.clickNumber === null ? 0 : recipeRating.clickNumber;
      recipeRating.timestamp = new Date();
      user.markModified('recipeRatings');
    } else {
      user.recipeRatings.push({
        recipeId,
        rating,
        comment,
        clickNumber: 0,
        timestamp: new Date(),
      });
    }

    await user.save();

    return user.recipeRatings;
  }

  async addRecipeClick(userId: string, recipeId: number) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const recipeRating = user.recipeRatings.find(
      (rating) => rating.recipeId === recipeId,
    );

    if (recipeRating) {
      if (recipeRating.clickNumber === undefined) {
        recipeRating.clickNumber = 0;
      }
      if (recipeRating.clickNumber === null) {
        recipeRating.clickNumber = 0;
      } else {
        recipeRating.clickNumber += 1;
        recipeRating.timestamp = new Date();
      }
      user.markModified('recipeRatings');
    } else {
      user.recipeRatings.push({
        recipeId,
        rating: undefined,
        comment: undefined,
        clickNumber: 1,
        timestamp: new Date(),
      });
    }

    await user.save();

    return user.recipeRatings
  }

  async getRecipeRatings(userId: string, recipeId: number) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const recipeRating = user.recipeRatings.find(
      (rating) => rating.recipeId === recipeId,
    );

    if (recipeRating) {
      return recipeRating;
    } else {
      throw new NotFoundException('Recipe rating not found');
    }
  }

  async updateUserPreference( 
    userId: string,
    userPreference: userPreferenceDto
  ) {
    try {
        const { recipeOptions, dietaryRestrictions } = userPreference;

        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        } 
        user.user_type = userPreference.userType;
        user.recipe_preference = recipeOptions;
        user.dietary_restrictions = dietaryRestrictions;
        user.isSurveyed = true;

        return await user.save();
    } catch (error) {
        throw new HttpException(
            'Failed to update user preference: ' + error.message,
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
  }
}
