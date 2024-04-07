import { ApiProperty } from '@nestjs/swagger';

export class UpdateLatencyDto {
  @ApiProperty({ description: 'the delay to be set' })
  delay: number;
}
