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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const mailer_service_1 = require("@nestjs-modules/mailer/dist/mailer.service");
const common_1 = require("@nestjs/common");
let MailService = exports.MailService = class MailService {
    constructor(mailerService) {
        this.mailerService = mailerService;
    }
    async sendUserConfirmation(user, token) {
        const url = `https://pak-endo-admin.vercel.app/auth/reset-password?id=${user.id}&token=${token}`;
        return await this.mailerService.sendMail({
            to: user.email,
            from: 'noreply@admin.com',
            subject: 'RESET PASSWORD REQUEST',
            template: './confirmation',
            context: {
                name: user?.fullName,
                url,
            },
        }).then((response) => {
            return response;
        })
            .catch((err) => {
            throw new common_1.BadRequestException(err);
        });
    }
    async sendApprovalRequestToAdmin(user) {
        return await this.mailerService.sendMail({
            to: 'muhammadmohid141@gmail.com',
            from: 'noreply@admin.com',
            subject: 'Request for Account Approval',
            template: './approval',
            context: {
                name: user?.fullName
            },
        }).then((response) => {
            return response;
        })
            .catch((err) => {
            throw new common_1.BadRequestException('Something went wrong. Please try again');
        });
    }
    async sendEmailToMember(user, memberId, type) {
        return await this.mailerService.sendMail({
            to: user?.email,
            from: 'noreply@admin.com',
            subject: 'Member ID assigned',
            template: './memberID',
            context: {
                name: user?.fullName,
                memberID: memberId,
                membershipType: type
            },
        }).then((response) => {
            return response;
        })
            .catch((err) => {
            throw new common_1.BadRequestException('Something went wrong. Please try again');
        });
    }
    async sendDefaultPasswordEmail(user) {
        return await this.mailerService.sendMail({
            to: user?.email,
            from: 'noreply@admin.com',
            subject: 'New Member Created',
            template: './defaultPass',
            context: {
                name: user?.fullName,
                memberID: user?.memberID,
                membershipType: user?.type,
                password: user?.password
            },
        }).then((response) => {
            return response;
        })
            .catch((err) => {
            throw new common_1.BadRequestException('Something went wrong. Please try again');
        });
    }
};
exports.MailService = MailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mailer_service_1.MailerService])
], MailService);
//# sourceMappingURL=mail.service.js.map