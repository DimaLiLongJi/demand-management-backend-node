import { Injectable } from '@nestjs/common';
import { EnvService, ConfigType } from './env.service';
import * as nodemailer from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';

@Injectable()
export class EmailService {
  private emailConfig: ConfigType['email'];
  private transporter: Mail;
  constructor(private envService: EnvService) {
    this.emailConfig = this.envService.getConfig().email;
    this.transporter = nodemailer.createTransport(this.emailConfig);
  }

  public sendEmail(toUserEmail: string, content: {
    fromUserName: string,
    demandId: number,
  }) {
    try {
      if (!this.transporter) throw new Error('未初始化邮箱');
      console.log(444444444, this.transporter);
      const contentUrl =  this.envService.getConfig().contentUrl + content.demandId;
      this.transporter.sendMail({
        from: `"需求管理平台邮件" <${this.emailConfig.auth.user}>`,
        to: toUserEmail,
        subject: '小伙子，你被安排了',
        html: `<p>${content.fromUserName} 给你安排了一个需求，请打开<a href="${contentUrl}">${contentUrl}</a></p>`,
      }, (err, info) => {
        console.log(555555555, err);
        console.log(444444444, info);
      });
    } catch (error) {
      console.error('send emila error:', error);
    }
  }
}
