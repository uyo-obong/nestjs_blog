import { Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { UserService } from './user.service';
import { UserEntity } from '../entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser } from '../auth/user.decorator';

@Controller('profiles')
export class ProfileController {
  constructor(private UserService: UserService) {}

  @Get(':username')
  async findUserByProfile(@Param('username') username: string) {
    const profile = await this.UserService.findUser(username);
    return { profile };
  }

  @Post(':user/follow')
  @UseGuards(AuthGuard())
  async follow(@AuthUser() username: UserEntity, @Param('user') user: string) {
    const profile = await this.UserService.follow(username, user);
    return { profile };
  }

  @Delete(':user/unfollow')
  @UseGuards(AuthGuard())
  async unfollow(@AuthUser() username: UserEntity, @Param('user') user: string) {
    const profile = await this.UserService.unfollow(username, user);
    return { profile };
  }
}
