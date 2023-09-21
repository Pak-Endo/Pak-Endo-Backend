import { ApiProperty } from '@nestjs/swagger'

export class SponsorDto {
  @ApiProperty()
  _id: string

  @ApiProperty()
  sponsorName: string;

  @ApiProperty()
  sponsorLogo: string;

  @ApiProperty()
  uniqueID: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  deletedCheck: boolean;

  @ApiProperty()
  contact: string;
}