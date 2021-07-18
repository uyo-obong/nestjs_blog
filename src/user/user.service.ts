import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private userRepo: Repository<UserEntity>) {}

  async findUser(data) {
    try {
      const username = await this.userRepo.findOne({
        where: { username: data },
      });
      if (!username) {
        return await this.userRepo.findOne({ where: { id: data } });
      }
      return username;
    } catch (e) {
      throw new NotFoundException('User not found');
    }
  }

  async updateUser(id: string, data) {
    try {
      await this.userRepo.update({ id }, data);
      return this.userRepo.findOne(id);
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async follow(authUser: UserEntity, username: string): Promise<UserEntity> {
    const user = await this.userRepo.findOne({
      where: { username },
      relations: ['followers'],
    });

    const getAuthUser = await this.userRepo.findOne(authUser.id);
    user.followers.push(getAuthUser);
    await user.save();
    return user.followersCheck(getAuthUser);
  }

  async unfollow(authUser: UserEntity, username: string) {
    const user = await this.userRepo.findOne({
      where: { username },
      relations: ['followers'],
    });

    const getAuthUser = await this.userRepo.findOne(authUser.id);
    user.followers = user.followers.filter(
      (follower) => follower !== getAuthUser);
    await user.save();
    return user.followersCheck(getAuthUser);
  }
}
