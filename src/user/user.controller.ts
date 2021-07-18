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
  async findCurrentUser(@AuthUser() { id }: UserEntity) {
    const user = await this.UserService.findUser(id);
    return { user };
  }

  @Put('update/profile')
  @UseGuards(AuthGuard())
  @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true, whitelist: true }))
  async updateUser(@AuthUser() { id }: UserEntity, @Body() data: UpdateUserDTO) {
    const user = await this.UserService.updateUser(id, data);
    return { user };
  }
}
