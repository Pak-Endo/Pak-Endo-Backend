import { ApiProperty } from "@nestjs/swagger";
import { EventStatus } from "src/schemas/events.schema";
import { Gallery } from "src/schemas/gallery.schema";

export class EventDto {
  @ApiProperty()
  _id: string

  @ApiProperty()
  title: string

  @ApiProperty()
  description: string;

  @ApiProperty()
  startDate: Date | number;

  @ApiProperty()
  endDate: Date | number;

  @ApiProperty()
  featuredImage: string;

  @ApiProperty({
    example: {
      mediaUrl: ['']
    }
  })
  gallery: Gallery;

  @ApiProperty()
  eventStatus: EventStatus;

  @ApiProperty()
  deletedCheck: boolean;

  @ApiProperty()
  streamUrl: string;

}