import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateArticleDTO {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  body: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];
}

export class UpdateArticleDTO {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  body: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags: string[];
}

export interface FindFeedQuery {
  limit?: number;
  offset?: number;
}

export interface FindAllQuery extends FindFeedQuery {
  author?: string;
  tag?: string;
  favorite?: string;
}
