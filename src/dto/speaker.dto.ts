import { ApiProperty } from '@nestjs/swagger'

export class SpeakerDto {
  @ApiProperty()
  _id: string

  @ApiProperty()
  speakerName: string;

  @ApiProperty()
  speakerTeam: any[];

  @ApiProperty()
  speakerImg: string;

  @ApiProperty()
  uniqueID: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  deletedCheck: boolean;
}