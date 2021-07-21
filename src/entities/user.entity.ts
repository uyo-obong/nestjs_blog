import { AbstractEntity } from './abstract/abstract.entity';
import { BeforeInsert, Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { classToPlain, Exclude } from 'class-transformer';
import { IsEmail } from 'class-validator';
import * as bcrypt from 'bcryptjs';
import { ArticleEntity } from './article.entity';
import { CommentEntity } from './comment.entity';

@Entity('users')
export class UserEntity extends AbstractEntity {
  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ unique: true })
  username: string;

  @Column({ default: '', type: 'text' })
  bio: string;

  @Column({ default: null, nullable: true })
  image: string | null;

  @Column()
  @Exclude()
  password: string;

  @JoinTable()
  @ManyToMany(type => UserEntity, user => user.followee)
  followers: UserEntity[];

  @ManyToMany(type => UserEntity, user => user.followers)
  followee: UserEntity[];

  @ManyToOne(type => ArticleEntity, articles => articles.author)
  articles: ArticleEntity[];

  @ManyToMany(type => ArticleEntity, article => article.favoritedBy)
  favorites: ArticleEntity[];

  @OneToMany(type => CommentEntity, comment => comment.author)
  comments: CommentEntity[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(attempt: string) {
    return await bcrypt.compare(attempt, this.password);
  }

  toJSON() {
    return classToPlain(this);
  }

  followersCheck(user: UserEntity) {
    let following = null;
    if (user) {
      following = this.followers.includes(user);
    }
    const profile: any = this.toJSON();
    delete profile.followers;
    return { ...profile, following };
  }
}
