import { Body, Controller, Get, Put, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserService } from './user.service';
import { AuthUser } from '../auth/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from '../entities/user.entity';
import { UpdateUserDTO } from '../models/user.dto';

@Controller('users')
export class UserController {
  constructor(private UserService: UserService) {}

  @Get('auth')
  @UseGuards(AuthGuard())
  findCurrentUser(@AuthUser() { id }: UserEntity) {
    return this.UserService.findUser(id);
  }

  @Put('update/profile')
  @UseGuards(AuthGuard())
  @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true, whitelist: true }))
  updateUser(@AuthUser() { id }: UserEntity, @Body() data: UpdateUserDTO) {
    return this.UserService.updateUser(id, data);
  }
}
