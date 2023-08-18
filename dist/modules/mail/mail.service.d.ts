import { MailerService } from '@nestjs-modules/mailer/dist/mailer.service';
import { User } from 'src/schemas/user.schema';
export declare class MailService {
    private mailerService;
    constructor(mailerService: MailerService);
    sendUserConfirmation(user: User | any, token: string): Promise<any>;
    sendApprovalRequestToAdmin(user: User | any): Promise<any>;
}
