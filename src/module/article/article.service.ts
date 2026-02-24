import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { In, Repository } from 'typeorm';
import { Tag } from '../tags/entities/tag.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article) private articleRepo: Repository<Article>,
    @InjectRepository(Tag) private tagRepo: Repository<Tag>
  ){}
  async create(createArticleDto: CreateArticleDto, file: Express.Multer.File, userid: number):Promise<Article> {
    try {
      const tags  = await this.tagRepo.findBy({
        id: In(createArticleDto.tags)
      })
      const article = this.articleRepo.create({
        ...createArticleDto,
        tags,
      })

      article.backgroundImage = `http://localhost:4001/uploads${file.filename}`
      return await this.articleRepo.save(article)
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async findAll():Promise<Article[]> {
    try {
      return await this.articleRepo.find()
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async findOne(id: number): Promise<Article> {
     try {
      const foundedArticle = await this.articleRepo.findOne({where: {id}})

      if(!foundedArticle) throw new NotFoundException("Article not found")

      return foundedArticle
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  // async update(id: number, updateArticleDto: UpdateArticleDto): Promise<{message: string}> {
  //   try {
  //     const foundedArticle = await this.articleRepo.findOne({where: {id}})

  //     if(!foundedArticle) throw new NotFoundException("Article not found")

  //     await this.articleRepo.update(foundedArticle.id, updateArticleDto)

  //     return {message: "Updated article"}
  //   } catch (error) {
  //     throw new InternalServerErrorException(error.message)
  //   }
  // }

  async remove(id: number): Promise<{message: string}> {
    try {
       const foundedArticle = await this.articleRepo.findOne({where: {id}})

      if(!foundedArticle) throw new NotFoundException("Article not found")

      await this.articleRepo.delete(foundedArticle.id)

      return {message: "deleted article"}
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
