/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { MailerService } from '@nestjs-modules/mailer/dist/mailer.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {}

    async sendUserConfirmation(user: User | any, token: string) {
      const url = `aaa.com/auth/reset-password?id=${user.id}&token=${token}`;
      return await this.mailerService.sendMail({
        to: user.email,
        from: 'noreply@event-manager.com',
        subject: 'RESET PASSWORD REQUEST',
        template: './confirmation',
        context: {
          name: user?.fullName,
          url,
        },
      }).then((response: any) => {
        return response
      })
      .catch((err: any) => {
        throw new BadRequestException(err)
      });
    }

    async sendApprovalRequestToAdmin(user: User | any) {
      return await this.mailerService.sendMail({
        to: 'admin@gmail.com',
        from: 'noreply@event-manager.com',
        subject: 'Request for Account Approval',
        template: './approval',
        context: {
          name: user?.fullName
        },
      }).then((response: any) => {
        return response
      })
      .catch((err: any) => {
        throw new BadRequestException(err)
      });
    }
}