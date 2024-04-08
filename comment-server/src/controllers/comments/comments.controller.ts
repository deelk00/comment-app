import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
  Sse,
} from '@nestjs/common';
import { CommentsService } from '../../services/comments/comments.service';
import { Comment } from '../../model/common/comment';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCommentDto } from '../../model/requests/create-comment.dto';
import { CommentDto } from '../../model/responses/comment.dto';
import { map, Observable } from 'rxjs';
import { Response } from 'express';

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
    type: CommentDto,
  })
  likeComment(@Param('id') id: string) {
    return this.commentsService.likeComment(Number(id));
  }

  @Sse('subscribe')
  @ApiOperation({ summary: 'subscribe to changes of the comment repository' })
  @ApiResponse({
    status: 200,
    description: 'successfully subscribed',
    type: CommentDto,
  })
  subscribe(): Observable<MessageEvent> {
    return new Observable((observer) => {
      const callback = (message: string, data: Comment) => {
        observer.next({ message, data });
      };

      this.commentsService.subscribe(callback);

      // Cleanup on client disconnect
      return () => {
        this.commentsService.unsubscribe(callback);
      };
    }).pipe(
      map((data: any) => {
        return { message: data.message, data: {message: data.message, data: data.data} };
      }),
    ) as any;
  }
}
