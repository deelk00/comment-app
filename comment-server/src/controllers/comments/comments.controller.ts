import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CommentsService } from '../../services/comments/comments.service';
import { Comment } from '../../model/common/comment';
import { ApiExtraModels, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateCommentDto } from "../../model/requests/create-comment.dto";
import { CommentDto } from "../../model/responses/comment.dto";

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all comments' })
  @ApiResponse({
    status: 200,
    description: 'Successfully returned the comments',
    type: [CommentDto],
  })
  getComments(): Promise<Comment[]> {
    return this.commentsService.getComments();
  }

  @Post()
  @ApiOperation({ summary: 'Add a new comment' })
  @ApiResponse({
    status: 201,
    description: 'The comment has been successfully created.',
    type: CommentDto,
  })
  addComment(@Body() dto: CreateCommentDto) {
    const comment = new Comment();
    comment.content = dto.content;
    comment.authorName = dto.authorName;
    comment.likes = 0;
    
    return this.commentsService.addComment(comment);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiResponse({
    status: 200,
    description: 'The comment has been successfully deleted.',
    type: CommentDto,
  })
  deleteComment(@Param('id') id: string) {
    return this.commentsService.deleteComment(Number(id));
  }

  @Patch(':id/like')
  @ApiOperation({ summary: 'Like a comment' })
  @ApiResponse({
    status: 200,
    description: 'The comment has been successfully liked.',
    type: CommentDto
  })
  likeComment(@Param('id') id: string) {
    return this.commentsService.likeComment(Number(id));
  }
}
