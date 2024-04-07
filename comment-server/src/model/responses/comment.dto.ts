import { ApiProperty } from '@nestjs/swagger';

export class CommentDto {
  @ApiProperty({ description: 'unique id of the comment' })
  id: number;
  @ApiProperty({ description: 'content of the comment' })
  content: string;
  @ApiProperty({ description: 'author of the comment' })
  authorName: string;
  @ApiProperty({ description: 'number of likes the comment has' })
  likes: number;
}
