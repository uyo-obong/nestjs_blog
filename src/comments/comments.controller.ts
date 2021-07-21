import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser } from '../auth/user.decorator';
import { UserEntity } from '../entities/user.entity';
import { CreateCommentDTO } from '../models/comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    const comment = await this.commentService.findBySlug(slug);
    return { comment };
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    const comment = this.commentService.findById(id);
    return { comment };
  }

  @Post('create')
  @UseGuards(AuthGuard())
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  createComment(@AuthUser() user: UserEntity, @Body() data: CreateCommentDTO) {
    const comment = this.commentService.createComment(user, data);
    return { comment };
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  deleteComment(@AuthUser() user: UserEntity, @Param('id') id: string) {
    const comment = this.commentService.deleteComment(user, id);
    return { comment };
  }
}
