import { ApiProperty } from '@nestjs/swagger'

export class VenueDto {
  @ApiProperty()
  _id: string

  @ApiProperty()
  city: string;

  @ApiProperty()
  venueName: string;

  @ApiProperty()
  halls: string[];

  @ApiProperty()
  deletedCheck: boolean;
}