import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { LoginDTO, RegisterDTO } from '../models/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    private jwtService: JwtService
  ) {}

  async register(data: RegisterDTO) {
    try {
      const user = this.userRepo.create(data);
      return await user.save();
    } catch (e) {
      if (e.code === 23505) {
        throw new ConflictException('User has already been taken');
      }
      throw new InternalServerErrorException('Oops something went wrong');
    }
  }

  async login(data: LoginDTO) {
    try {
      const user = await this.userRepo.findOne({
        where: { email: data.email },
      });

      const isValid = await user.comparePassword(data.password);

      if (!isValid) {
        throw new NotFoundException('email or password');
      }
      const payload = { id: user.id, email: user.email };
      const token = this.jwtService.sign(payload);

      return { user: { ...user.toJSON(), token } };
    } catch (e) {
      throw new BadRequestException('email or password not found');
    }
  }
}
