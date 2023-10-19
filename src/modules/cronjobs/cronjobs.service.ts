import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { Event, EventStatus } from 'src/schemas/events.schema';
import axios from 'axios';
import { User } from 'src/schemas/user.schema';
@Injectable()
export class CronjobsService {
  constructor(@InjectModel('Events') private readonly eventModel: Model<Event>,
              @InjectModel('User') private readonly userModel: Model<User>,
  ) {}

  @Cron( CronExpression.EVERY_30_SECONDS )
  async startCronJobForEventStatus() {
    const url = 'https://fcm.googleapis.com/fcm/send';
    const serverKey = 'AAAAiB9Sdls:APA91bFtTcWBJnXe8XOztk_QR2_FJm5LyaR90on76PGdiK32_3HVnNvMAhAmSPwp8SONQYXpkKui3L8rIVjVSIqoemdpoIOkuCfeLizlEJS8Si7N3jrQgFD8wrYxzRhZUB8kmoIjh8Gw';

    const headers = {
      'Authorization': 'key=' + serverKey,
      'Content-Type': 'application/json',
    };

    const usersToNotify = await this.userModel.find({
      deviceToken: { $ne: null },
    });

    var deviceToken = [];
    for (const user of usersToNotify) {
        deviceToken.push(user.deviceToken); //make array
    }
    
    let currentDateTime = new Date();
    const eventsToUpdate = await this.eventModel.find({
      startDate: { $gte: currentDateTime },
      eventStatus: EventStatus.UPCOMING,
    });

    if (eventsToUpdate.length > 0) {
      console.log('JANU')
      for (const event of eventsToUpdate) {
        event.eventStatus = EventStatus.ONGOING;
        await event.save();

      console.log('Sending push notification for ongoing events')
      const title=event.title; 
      const description=event.description; 
      const data = {
       registration_ids: deviceToken,
       notification: {
         title: 'The Event ' + title + 'has been started',
         body: description,
       },
     };

     axios.post(url, data, { headers })
     .then(response => {
       console.log('Response:', response.data);
     })
     .catch(error => {
       console.error('Error:', error);
     });
      }
    }
  }

  @Cron( CronExpression.EVERY_30_SECONDS )
  async endCronJobForEventStatus()  {

    const url = 'https://fcm.googleapis.com/fcm/send';
    const serverKey = 'AAAAiB9Sdls:APA91bFtTcWBJnXe8XOztk_QR2_FJm5LyaR90on76PGdiK32_3HVnNvMAhAmSPwp8SONQYXpkKui3L8rIVjVSIqoemdpoIOkuCfeLizlEJS8Si7N3jrQgFD8wrYxzRhZUB8kmoIjh8Gw';

    const headers = {
      'Authorization': 'key=' + serverKey,
      'Content-Type': 'application/json',
    };

    const usersToNotify = await this.userModel.find({
      deviceToken: { $ne: null },
    });

    var deviceToken = [];
    for (const user of usersToNotify) {
        deviceToken.push(user.deviceToken); //make array
    }
    let currentDateTime = new Date().getTime();
    const eventsToUpdate = await this.eventModel.find({
      endDate: { $lte: currentDateTime },
      eventStatus: EventStatus.ONGOING,
    });

    if (eventsToUpdate.length > 0) {
      for (const event of eventsToUpdate) {
        event.eventStatus = EventStatus.FINSIHED;
        await event.save();

      console.log('Sending push notification for ongoing events')
        const title=event.title; 
       const description=event.description; 
       const data = {
        registration_ids: deviceToken,
        notification: {
          title: 'The Event ' + title + ' has been completed',
          body: description,
        },
      };

      axios.post(url, data, { headers })
      .then(response => {
        console.log('Response:', response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
      }
      console.log('END JANU')
    }
  }

  @Cron( CronExpression.EVERY_30_MINUTES )
  async startCronJobToNotifyUpcomingEvent() {
    let currentDateTime = new Date();
    console.log('currentDateTime', currentDateTime);
    let oneHourBefore= currentDateTime;
    oneHourBefore.setHours(currentDateTime.getHours() + 1)
    console.log('oneHourBefore ',oneHourBefore.toISOString());
    const eventsUpcoming = await this.eventModel.find({
      startDate: { $lte: oneHourBefore },
      eventStatus: EventStatus.UPCOMING,
    });
    // const eventsUpcoming = await this.eventModel.find({
    //   title: { $lte: 'EOM Nov' },
    // });

    const url = 'https://fcm.googleapis.com/fcm/send';
    const serverKey = 'AAAAiB9Sdls:APA91bFtTcWBJnXe8XOztk_QR2_FJm5LyaR90on76PGdiK32_3HVnNvMAhAmSPwp8SONQYXpkKui3L8rIVjVSIqoemdpoIOkuCfeLizlEJS8Si7N3jrQgFD8wrYxzRhZUB8kmoIjh8Gw';

    const headers = {
      'Authorization': 'key=' + serverKey,
      'Content-Type': 'application/json',
    };

    const usersToNotify = await this.userModel.find({
      deviceToken: { $ne: null },
    });

    var deviceToken = [];
    for (const user of usersToNotify) {
        deviceToken.push(user.deviceToken); //make array
    }

    if (eventsUpcoming.length > 0) {
      console.log('Sending push notification for upcoming events')
      for (const event of eventsUpcoming) {
       const title=event.title; 
       const description=event.description; 
       const data = {
        registration_ids: deviceToken,
        notification: {
          title: 'The Event '+ title + ' is about to start in an hour',
          body: description,
        },
      };
      axios.post(url, data, { headers })
      .then(response => {
        console.log('Response:', response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
      }

      
    }
  }
}
