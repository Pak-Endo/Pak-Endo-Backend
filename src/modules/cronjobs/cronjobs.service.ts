import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { Event, EventStatus } from 'src/schemas/events.schema';

@Injectable()
export class CronjobsService {
  constructor(@InjectModel('Events') private readonly eventModel: Model<Event>) {}

  @Cron( CronExpression.EVERY_30_SECONDS )
  async startCronJobForEventStatus() {
    console.log('JANU')
    let currentDateTime = new Date().getTime()
    const eventsToUpdate = await this.eventModel.find({
      startDate: { $lte: currentDateTime },
      eventStatus: EventStatus.UPCOMING,
    });

    if (eventsToUpdate.length > 0) {
      for (const event of eventsToUpdate) {
        event.eventStatus = EventStatus.ONGOING;
        await event.save();
      }
    }
  }

  @Cron( CronExpression.EVERY_30_SECONDS )
  async endCronJobForEventStatus()  {
    let currentDateTime = new Date().getTime()
    const eventsToUpdate = await this.eventModel.find({
      endDate: { $gte: currentDateTime },
      eventStatus: EventStatus.ONGOING,
    });

    if (eventsToUpdate.length > 0) {
      for (const event of eventsToUpdate) {
        event.eventStatus = EventStatus.FINSIHED;
        await event.save();
      }
    }
  }
}
