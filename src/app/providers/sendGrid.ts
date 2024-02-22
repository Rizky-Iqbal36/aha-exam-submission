import axios, { AxiosInstance } from 'axios';
import { InternalServerError } from '@app/exception';
import { sendgridConfig } from '@app/config';

class SendGridProvider {
  private readonly client: AxiosInstance;
  constructor() {
    this.client = axios.create({
      baseURL: 'https://api.sendgrid.com/v3',
      headers: {
        ['Authorization']: `Bearer ${sendgridConfig.secret}`,
      },
    });
  }

  public async sendEmail({ recipient, subject, message }: { recipient: string; subject: string; message: string }) {
    return this.client
      .post('/mail/send', {
        personalizations: [
          {
            to: [
              {
                email: recipient,
              },
            ],
          },
        ],
        from: {
          email: 'rizkiiqbal36@gmail.com',
          name: 'Rizky Ikbal',
        },
        subject,
        content: [
          {
            type: 'text/html',
            value: message,
          },
        ],
        tracking_settings: {
          click_tracking: {
            enable: true,
            enable_text: false,
          },
          open_tracking: {
            enable: true,
            substitution_tag: '%open-track%',
          },
          subscription_tracking: {
            enable: false,
          },
        },
      })
      .catch((err) => {
        throw new InternalServerError({ reason: err.message });
      });
  }
}

export default new SendGridProvider();
