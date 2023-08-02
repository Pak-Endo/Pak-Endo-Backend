/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { MailerService } from '@nestjs-modules/mailer/dist/mailer.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {}

    async sendUserConfirmation(user: User | any, token: string) {
      debugger
        const url = `animetography-blog.com/auth/confirm?id=${user.id}&token=${token}`;
        return await this.mailerService.sendMail({
          to: user.email,
          from: '"System Administrator"',
          subject: 'RESET PASSWORD REQUEST',
          template: './confirmation',
          context: {
            name: user?.prefix + ' ' + user?.firstName + ' ' + user?.lastName,
            url,
          },
        }).then((response: any) => {
          debugger
            return response
        })
        .catch((err: any) => {
          debugger
            throw new BadRequestException(err)
        });
      }
}