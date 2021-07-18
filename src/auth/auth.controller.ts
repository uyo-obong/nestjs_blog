import { Body, Controller, Post, UsePipes, ValidationPipe } from "@nestjs/common";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AuthService } from './auth.service';
import { LoginDTO, RegisterDTO } from '../models/user.dto';

@Controller('users')
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  register(@Body() request: RegisterDTO) {
    return this.AuthService.register(request);
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  login(@Body() request: LoginDTO) {
    return this.AuthService.login(request);
  }
}
