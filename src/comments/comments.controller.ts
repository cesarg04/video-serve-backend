import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Auth } from 'src/auth/decorators/auth/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user/get-user.decorator';
import { User } from 'src/auth/entities/USER.entity';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post(':id')
  @Auth()
  addComment(
    @Param(
      'id', ParseUUIDPipe) id: string,
    @Body() commentDto: CreateCommentDto,
    @GetUser() user: User,
  ){
    return this.commentsService.addComment(id, user, commentDto)
  }

  // Get Comment By id
  @Auth()
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.commentsService.findOne(id);
  }

  @Auth()
  @Patch(':id')
  update
  (@Param('id', ParseUUIDPipe) id: string, 
  @Body() updateCommentDto: UpdateCommentDto,
  @GetUser() user: User
  ) {
    return this.commentsService.update(id, updateCommentDto, user);
  }

  @Delete(':id')
  @Auth()
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User
    ) {
    return this.commentsService.remove(id, user);
  }

}
