import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string) {
    if (!email || !pass) {
      throw new HttpException('Missing parameter', HttpStatus.BAD_REQUEST);
    }
    const user = await this.usersService.findOne(email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }
    const flag = await bcrypt.compare(pass, user?.password);
    if (!flag) {
      throw new HttpException('Wrong password', HttpStatus.UNAUTHORIZED);
    }
    const payload = { sub: user._id, name: user.name, email: user.email };
    const { password, ...retUser } = user.toObject();
    password;
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: retUser,
    };
  }

  async signInWithGoogle(name: string, email: string) {
    if (!name || !email) {
      throw new HttpException('Missing parameter', HttpStatus.BAD_REQUEST);
    }
    let user = await this.usersService.findOne(email);
    if (!user) {
      user = await this.usersService.create({ name, email });
    }
    const payload = { sub: user._id, name: user.name, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: user.toObject(),
    };
  }

  async signUp(name: string, email: string, pass: string) {
    if (!name || !email || !pass) {
      throw new HttpException('Missing parameter', HttpStatus.BAD_REQUEST);
    }
    const user = await this.usersService.findOne(email);
    if (user) {
      throw new HttpException('Email already exists', HttpStatus.BAD_GATEWAY);
    }
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(pass, saltOrRounds);
    const newUser = await this.usersService.create({
      name,
      email,
      password: hashedPassword,
    });
    if (!newUser) {
      throw new HttpException('Error creating user', HttpStatus.BAD_GATEWAY);
    }
    const payload = {
      sub: newUser._id,
      name: newUser.name,
      email: newUser.email,
    };
    const { password, ...retUser } = newUser.toObject();
    password;
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: retUser,
    };
  }
}
