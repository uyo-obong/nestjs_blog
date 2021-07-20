import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put, Query,
  UseGuards,
  UsePipes,
  ValidationPipe
} from "@nestjs/common";
import { ArticleService } from './article.service';
import { AuthUser } from '../auth/user.decorator';
import { UserEntity } from '../entities/user.entity';
import { CreateArticleDTO, FindAllQuery, FindFeedQuery, UpdateArticleDTO } from "../models/article.dto";
import { AuthGuard } from '@nestjs/passport';
import { OptionalAuthGuard } from '../auth/optional-auth.gaurd';

@Controller('article')
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @Get('all')
  @UseGuards(new OptionalAuthGuard())
  async findAll(@AuthUser() user: UserEntity, @Query() query: FindAllQuery) {
    const article = await this.articleService.findAll(user, query);
    return { article, articleCount: article.length };
  }

  @Get('feed')
  @UseGuards(AuthGuard())
  async findFeed(@AuthUser() user: UserEntity, query: FindFeedQuery) {
    const article = await this.articleService.findFeed(user, query);
    return { article, articleCount: article.length };
  }

  @Get(':slug')
  @UseGuards(new OptionalAuthGuard())
  async findBySlug(@Param('slug') slug: string, @AuthUser() user: UserEntity) {
    const article = await this.articleService.findBySlug(slug);
    return { article: article.toArticles(user) };
  }

  @Post('create')
  @UseGuards(AuthGuard())
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async createArticle(@AuthUser() user: UserEntity, @Body() data: CreateArticleDTO) {
    const article = await this.articleService.createArticle(user, data);
    return { article };
  }

  @Put('update/:slug')
  @UseGuards(AuthGuard())
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateArticle(
    @Param('slug') slug: string,
    @AuthUser() user: UserEntity,
    @Body() data: UpdateArticleDTO,
  ) {
    const article = await this.articleService.updateArticle(slug, user, data);
    return { article };
  }

  @Delete('delete/:slug')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async deleteArticle(@Param('slug') slug: string, @AuthUser() user: UserEntity ) {
    const article = await this.articleService.deleteArticle(slug, user);
    return { article };
  }

  @Post(':slug/favorite')
  @UseGuards(AuthGuard())
  async favoriteArticle(@AuthUser() user: UserEntity, @Param('slug') slug: string) {
    const favorite = await this.articleService.favoriteArticle(user, slug);
    return { favorite };
  }

  @Delete(':slug/favorite')
  @UseGuards(AuthGuard())
  async unFavoriteArticle(@AuthUser() user: UserEntity, @Param('slug') slug: string) {
    const favorite = await this.articleService.unFavoriteArticle(user, slug);
    return { favorite };
  }
}
