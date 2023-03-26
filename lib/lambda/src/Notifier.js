import fetch from 'node-fetch';

export class Notifier {
  constructor() {
    this.LINE_BEARER_TOKEN = process.env.LINE_BEARER_TOKEN;
    if (this.LINE_BEARER_TOKEN === '') {
      throw Error('缺少 Line token');
    }
  }

  async sendNotification(message) {
    const res = await fetch(`https://notify-api.line.me/api/notify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${this.LINE_BEARER_TOKEN}`,
      },
      body: new URLSearchParams({ message }),
    });
    const data = await res.json();
    console.log(data);
    return data;
  }
}

export default Notifier;
