import { ApiProperty } from "@nestjs/swagger";

export class FavoritesDto {
  @ApiProperty()
  eventID: string

  @ApiProperty()
  userID: string;
}