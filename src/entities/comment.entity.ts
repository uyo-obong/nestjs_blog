import { AbstractEntity } from './abstract/abstract.entity';
import { Column, Entity, ManyToOne } from "typeorm";
import { UserEntity } from "./user.entity";
import { ArticleEntity } from "./article.entity";

@Entity('comments')
export class CommentEntity extends AbstractEntity {
  @Column({ type: 'text' })
  body: string;

  @ManyToOne(type => UserEntity, user => user.comments)
  author: UserEntity;

  @ManyToOne(type => ArticleEntity, article => article.comment)
  article: ArticleEntity;

  toJSON() {
    return 
  }
}