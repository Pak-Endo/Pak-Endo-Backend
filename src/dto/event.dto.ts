import { ApiProperty } from "@nestjs/swagger";
import { AgendaInterface, EventStatus, sponsorType } from "src/schemas/events.schema";
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

  @ApiProperty()
  location: sponsorType;

  @ApiProperty()
  type: string;

  @ApiProperty()
  grandSponsor: sponsorType;

  @ApiProperty()
  rating: number;

  @ApiProperty()
  openForPublic: boolean;

  @ApiProperty()
  grandSponsorContact: string;

  @ApiProperty({
    example:
    {food: '', venue: '', speaker: '', overall: '', comments: ''}
  })
  eventFeedback: string;

  @ApiProperty({
    example: [
      {
        _id: '',
        theme: '',
        from: '',
        day: 0,
        agendaTitle: '',
        to: '',
        hall: '',
        streamUrl: '',
        speaker: '' 
      }
    ]
  })
  agenda: AgendaInterface[];

}