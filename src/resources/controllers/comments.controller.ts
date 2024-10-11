import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { CommentsService } from '../services/comments.service';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { ApiTags } from '@nestjs/swagger';
import { OneComment } from '../dto/one-comment.dto';


@Controller('comments')
@ApiTags('comments')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(createCommentDto);
  }

  @Get()
  findAll() {
    return this.commentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(id);
  }

  @Post(':comment_id/:product_id/:user_id')
  answerComment(@Param('comment_id') comment_id:string, @Param('product_id') product_id:string,@Param('user_id') user_id:string,@Body() commentAnswer: OneComment){
    const {comment} = commentAnswer
    console.log(comment)
    return this.commentService.answerComment(comment_id, product_id, user_id, comment);
  }

}
