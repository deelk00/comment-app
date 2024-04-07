import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ description: 'content of the comment' })
  content: string;
  @ApiProperty({ description: 'name of the commenter' })
  authorName: string;
}
