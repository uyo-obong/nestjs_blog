import { AbstractEntity } from './abstract/abstract.entity';
import { BeforeInsert, Column, Entity, JoinTable, ManyToMany, ManyToOne, RelationCount } from "typeorm";
import * as slugify from 'slug';
import { UserEntity } from './user.entity';
import { classToPlain } from 'class-transformer';

@Entity('articles')
export class ArticleEntity extends AbstractEntity {
  @Column({ unique: true })
  slug: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  body: string;

  @JoinTable()
  @ManyToMany((type) => UserEntity, (user) => user.favorites, { eager: true })
  favoritedBy: UserEntity[];

  @ManyToOne(type => UserEntity, user => user.articles, { eager: true})
  author: UserEntity;

  @Column({ default: 0 })
  favoritesCount: number;

  @Column({ type: 'simple-array' })
  tags: string[];

  @BeforeInsert()
  generateSlug() {
    this.slug =
      slugify(this.title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString();
  }

  toJSON() {
    return classToPlain(this);
  }

  toArticles(user?: UserEntity) {
    let favoriteBy = null;
    if (user) {
      favoriteBy = this.favoritedBy.map( user => user.id).includes(user.id);
    }
    const article: any = this.toJSON();
    delete article.favoritedBy;
    return { ...article, favoriteBy };
  }
}
