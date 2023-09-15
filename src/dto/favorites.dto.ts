import { ApiProperty } from "@nestjs/swagger";

export class FavoritesDto {
  @ApiProperty()
  _id: string

  @ApiProperty()
  eventID: string

  @ApiProperty()
  userID: string;

  @ApiProperty()
  deletedCheck: boolean;
}