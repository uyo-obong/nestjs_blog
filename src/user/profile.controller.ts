import { Controller, Get, Param } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserEntity } from "../entities/user.entity";

@Controller('profiles')
export class ProfileController {
  constructor(private UserService: UserService) {}

  @Get(':username')
  findUserByProfile(@Param('username') username: string) {
    return this.UserService.findUser(username);
  }
}
