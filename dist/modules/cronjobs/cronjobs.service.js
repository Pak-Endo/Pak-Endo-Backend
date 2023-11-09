"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronjobsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const schedule_1 = require("@nestjs/schedule");
const mongoose_2 = require("mongoose");
const events_schema_1 = require("../../schemas/events.schema");
const axios_1 = require("axios");
let CronjobsService = exports.CronjobsService = class CronjobsService {
    constructor(eventModel, userModel) {
        this.eventModel = eventModel;
        this.userModel = userModel;
    }
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
            deviceToken.push(user.deviceToken);
        }
        let currentDateTime = new Date();
        const eventsToUpdate = await this.eventModel.find({
            startDate: { $gte: currentDateTime },
            eventStatus: events_schema_1.EventStatus.UPCOMING,
        });
        if (eventsToUpdate.length > 0) {
            console.log('JANU');
            for (const event of eventsToUpdate) {
                event.eventStatus = events_schema_1.EventStatus.ONGOING;
                await event.save();
                console.log('Sending push notification for ongoing events');
                const title = event.title;
                const description = event.description;
                const data = {
                    registration_ids: deviceToken,
                    notification: {
                        title: 'The Event ' + title + 'has been started',
                        body: description,
                    },
                };
                axios_1.default.post(url, data, { headers })
                    .then(response => {
                    console.log('Response:', response.data);
                })
                    .catch(error => {
                    console.error('Error:', error);
                });
            }
        }
    }
    async endCronJobForEventStatus() {
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
            deviceToken.push(user.deviceToken);
        }
        let currentDateTime = new Date().getTime();
        const eventsToUpdate = await this.eventModel.find({
            endDate: { $lte: currentDateTime },
            eventStatus: events_schema_1.EventStatus.ONGOING,
        });
        if (eventsToUpdate.length > 0) {
            for (const event of eventsToUpdate) {
                event.eventStatus = events_schema_1.EventStatus.FINSIHED;
                await event.save();
                console.log('Sending push notification for ongoing events');
                const title = event.title;
                const description = event.description;
                const data = {
                    registration_ids: deviceToken,
                    notification: {
                        title: 'The Event ' + title + ' has been completed',
                        body: description,
                    },
                };
                axios_1.default.post(url, data, { headers })
                    .then(response => {
                    console.log('Response:', response.data);
                })
                    .catch(error => {
                    console.error('Error:', error);
                });
            }
            console.log('END JANU');
        }
    }
    async startCronJobToNotifyUpcomingEvent() {
        let currentDateTime = new Date();
        console.log('currentDateTime', currentDateTime);
        let oneHourBefore = currentDateTime;
        oneHourBefore.setHours(currentDateTime.getHours() + 1);
        console.log('oneHourBefore ', oneHourBefore.toISOString());
        const eventsUpcoming = await this.eventModel.find({
            startDate: { $lte: oneHourBefore },
            eventStatus: events_schema_1.EventStatus.UPCOMING,
        });
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
            deviceToken.push(user.deviceToken);
        }
        if (eventsUpcoming.length > 0) {
            console.log('Sending push notification for upcoming events');
            for (const event of eventsUpcoming) {
                const title = event.title;
                const description = event.description;
                const data = {
                    registration_ids: deviceToken,
                    notification: {
                        title: 'The Event ' + title + ' is about to start in an hour',
                        body: description,
                    },
                };
                axios_1.default.post(url, data, { headers })
                    .then(response => {
                    console.log('Response:', response.data);
                })
                    .catch(error => {
                    console.error('Error:', error);
                });
            }
        }
    }
};
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_30_SECONDS),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronjobsService.prototype, "startCronJobForEventStatus", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_30_SECONDS),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronjobsService.prototype, "endCronJobForEventStatus", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_30_MINUTES),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronjobsService.prototype, "startCronJobToNotifyUpcomingEvent", null);
exports.CronjobsService = CronjobsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Events')),
    __param(1, (0, mongoose_1.InjectModel)('User')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], CronjobsService);
//# sourceMappingURL=cronjobs.service.js.map