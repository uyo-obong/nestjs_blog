import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthPayload } from '../models/user.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectRepository(UserEntity) private userRepo: Repository<UserEntity>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: AuthPayload) {
    const { email } = payload;
    const user = await this.userRepo.findOne({ where: { email: email } });
    if (user) {
      return { id: user.id, email: user.email };
    }
    throw new UnauthorizedException();
    // return { id: payload.id, email: payload.email };
  }
}
