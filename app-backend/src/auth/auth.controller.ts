import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/SignIn.dto';
import { SignUpDto } from './dto/SignUp.dto';
import { SignInWithGoogleDto } from './dto/SignInWithGoogle.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Post('register')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(
      signUpDto.name,
      signUpDto.email,
      signUpDto.password,
    );
  }

  @Post('login-google')
  signInWithGoogle(@Body() signInWithGoogleDto: SignInWithGoogleDto) {
    return this.authService.signInWithGoogle(
      signInWithGoogleDto.name,
      signInWithGoogleDto.email,
    );
  }
}
