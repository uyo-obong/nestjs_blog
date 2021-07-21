import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from '../entities/comment.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { CreateCommentDTO } from '../models/comment.dto';

@Injectable()
export class CommentsService {
  constructor(@InjectRepository(CommentEntity) private commentRepository: Repository<CommentEntity>) {}

  findBySlug(slug: string) {
    return this.commentRepository.find({
      where: { 'article.slug': slug },
      relations: ['article'],
    });
  }

  findById(id: string) {
    return this.commentRepository.findOne({ where: { id: id } });
  }

  async createComment(user: UserEntity, data: CreateCommentDTO) {
    const comment = await this.commentRepository.create(data);
    comment.author = user;
    comment.save();

    return comment;
  }

  async deleteComment(user: UserEntity, id: string) {
    const comment = await this.commentRepository.findOne({
      where: { id, 'author.id': user.id },
    });
    await comment.remove();
    return true;
  }
}
