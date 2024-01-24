import got from 'got';
import * as FormData from 'form-data';
import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { MailModuleOptions } from './mail.interfaces';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS.mail) private readonly options: MailModuleOptions,
  ) {
    console.log(options);
    this.sendEmail('testing', 'test');
  }

  private async sendEmail(subject: string, content: string) {
    const form = new FormData();
    form.append('from', `Nuber <Nuber@${this.options.domain}>`);
    form.append('to', `${this.options.fromEmail}`);
    form.append('subject', subject);
    form.append('template', 'verify-email');
    form.append('v:code', 'test');
    form.append('v:username', 'soooooooooo');
    const response = await got(
      `https://api.mailgun.net/v3/${this.options.domain}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(
            `api:${this.options.apiKey}`,
          ).toString('base64')}`,
        },
        body: form,
      },
    );
    console.log(response.body);
  }
}
