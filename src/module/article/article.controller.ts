import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ApiBody, ApiConsumes, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import {diskStorage} from "multer"
import path from 'path';
import { CreateArticleSwaggerDto } from './dto/create-swagger.dto';

@ApiTags("Article")
@ApiInternalServerErrorResponse({description:"Internal server error"})
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}
  
  @ApiOperation({description:"Create article api {public}"})
  @ApiConsumes("multipart/form-data")
  @ApiBody({type: CreateArticleSwaggerDto})
  @ApiCreatedResponse({description:"created"})
  @UseInterceptors(
    FileInterceptor("file", {storage:diskStorage({
     destination: path.join(process.cwd(), "uploads"),
     filename:(req, file, cb ) => {
      const uniquename = `${file.fieldname}${Math.random() * 1e9}`
      const ext = path.extname(file.originalname)
      cb(null, `${uniquename}${ext}`)
     }
    })
  })
  )
  @Post()
  create(@Body() createArticleDto: CreateArticleDto, @UploadedFile() file: Express.Multer.File) {
    return this.articleService.create(createArticleDto, file);
  }
  @ApiOperation({description:"Get all article api {public}"})
  @ApiOkResponse({description:"list of articles"})
  @Get()
  findAll() {
    return this.articleService.findAll();
  }
  @ApiOperation({description:"Get one article api {public}"})
  @ApiNotFoundResponse({description:"Article not found"})
  @ApiOkResponse({description:"Get one article"})
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(+id);
  }
  @ApiOperation({description:"Update  article api {owner}"})
  @ApiBody({type: UpdateArticleDto})
  @ApiNotFoundResponse({description:"Article not found"})
  @ApiOkResponse({description:"Updated article"})
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articleService.update(+id, updateArticleDto);
  }
  @ApiOperation({description:"Delete article api {owner}"})
  @ApiNotFoundResponse({description:"Article not found"})
  @ApiOkResponse({description:"Deleted article"})
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articleService.remove(+id);
  }
}
