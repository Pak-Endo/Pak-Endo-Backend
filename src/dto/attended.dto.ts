import { ApiProperty } from "@nestjs/swagger";

export class AttendedDto {
  @ApiProperty()
  eventID: string

  @ApiProperty()
  userID: string;
}