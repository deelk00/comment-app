import { ApiProperty } from "@nestjs/swagger";

export class SettingsDto {
  @ApiProperty({description: "latency added to the start and end of a request"})
  delay: number;
}
