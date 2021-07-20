import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from '../entities/article.entity';
import { Like, Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { CreateArticleDTO, FindAllQuery, FindFeedQuery, UpdateArticleDTO } from "../models/article.dto";


@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findAll(user: UserEntity, query: FindAllQuery) {
    const findOptions: any = { where: {} };
    console.log(query.author);
    if (query.author) {
      findOptions.where['author.username'] = query.author;
    }

    if (query.favorite) {
      findOptions.where['favoritedBy.username'] = query.favorite;
    }

    if (query.tag) {
      findOptions.where.tags = Like(`%${query.tag}%`);
    }

    if (query.offset) {
      findOptions.offset = query.offset;
    }

    if (query.limit) {
      findOptions.limit = query.limit;
    }

    return (await this.articleRepository.find(findOptions)).map((favorite) =>
      favorite.toArticles(user),
    );
  }

  async findFeed(user: UserEntity, query: FindFeedQuery) {
    const { followee } = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['followee'],
    });
    const findOption = {
      ...query,
      where: followee.map((follow) => ({ author: follow.id })),
    };

    return (await this.articleRepository.find(findOption)).map((article) =>
      article.toArticles(user),
    );
  }

  async findBySlug(slug) {
    return await this.articleRepository.findOne({ where: { slug } });
  }

  async createArticle(user: UserEntity, data: CreateArticleDTO) {
    const article = this.articleRepository.create(data);
    article.author = user;
    const { slug } = await article.save();
    return (await this.articleRepository.findOne({ slug })).toArticles(user);
  }

  async updateArticle(slug: string, user: UserEntity, data: UpdateArticleDTO) {
    const article = this.findBySlug(slug);
    if (ArticleService.articleOwner(user, await article)) {
      await this.articleRepository.update({ slug }, data);
      return (await article).toArticles(user);
    }
    throw new UnauthorizedException("You can't update this article");
  }

  async deleteArticle(slug: string, user: UserEntity) {
    const article = this.findBySlug(slug);
    if (ArticleService.articleOwner(user, await article)) {
      await this.articleRepository.delete(slug);
      return { message: 'Article was deleted successfully' };
    }
    throw new UnauthorizedException("You can't delete this article");
  }

  async favoriteArticle(user: UserEntity, slug: string) {
    const article = await this.findBySlug(slug);
    article.favoritedBy.push(user);
    await article.save();
    return (await this.findBySlug(slug)).toArticles(user);
  }

  async unFavoriteArticle(user: UserEntity, slug: string) {
    const article = await this.findBySlug(slug);
    article.favoritedBy = article.favoritedBy.filter(
      (fav) => fav.id !== user.id,
    );
    await article.save();
    return (await this.findBySlug(slug)).toArticles(user);
  }

  private static articleOwner(
    user: UserEntity,
    article: ArticleEntity,
  ): boolean {
    return article.author.id === user.id;
  }
}
