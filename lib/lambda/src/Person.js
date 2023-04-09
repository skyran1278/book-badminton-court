import { add, format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import FormData from 'form-data';
import fetch from 'node-fetch';

import { COURT_ID_TO_NAME, COURT_NAME_TO_ID } from './config.js';

export class Person {
  constructor({ name, session, account, password, notifier }) {
    this.name = name;
    this.session = session;
    this.account = account;
    this.password = password;

    this.userAgent =
      'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1';

    this.notifier = notifier;
    this.bookingCourts = [];
    this.requestCount = 0;
    this.responseCount = 0;
  }

  async sendCourtAvailableNotification() {
    const bookingCourts = [
      { courtId: COURT_NAME_TO_ID.A, courtTime: '19' },
      { courtId: COURT_NAME_TO_ID.B, courtTime: '19' },
      { courtId: COURT_NAME_TO_ID.C, courtTime: '19' },
      { courtId: COURT_NAME_TO_ID.D, courtTime: '19' },
      { courtId: COURT_NAME_TO_ID.E, courtTime: '19' },
      { courtId: COURT_NAME_TO_ID.F, courtTime: '19' },
      { courtId: COURT_NAME_TO_ID.A, courtTime: '20' },
      { courtId: COURT_NAME_TO_ID.B, courtTime: '20' },
      { courtId: COURT_NAME_TO_ID.C, courtTime: '20' },
      { courtId: COURT_NAME_TO_ID.D, courtTime: '20' },
      { courtId: COURT_NAME_TO_ID.E, courtTime: '20' },
      { courtId: COURT_NAME_TO_ID.F, courtTime: '20' },
    ];
    const bookingDate = add(new Date(), { days: 8 });
    const bookingDateUrlString = format(bookingDate, 'yyyy-MM-dd');
    const bookingDateLogString = format(bookingDate, 'yyyy-MM-dd (iii)');

    try {
      const startTime = formatInTimeZone(
        new Date(),
        'Asia/Taipei',
        'HH:mm:ss.SSS'
      );
      const res = await fetch(
        `https://nd01.xuanen.com.tw/MobilePlace/MobilePlace?tFlag=2&PlaceType=1&SearchDate=${bookingDateUrlString}`,
        {
          method: 'GET',
          headers: {
            'User-Agent': this.userAgent,
            Cookie: `ASP.NET_SessionId=${this.session}`,
          },
        }
      );
      const availablePage = await res.text();
      const searchTime = formatInTimeZone(
        new Date(),
        'Asia/Taipei',
        'HH:mm:ss.SSS'
      );

      const isCourtAvailableArray = bookingCourts.map(
        ({ courtId, courtTime }) => {
          const searchRegexExpression = new RegExp(
            `BookingCheck\\(${courtId},'羽${COURT_ID_TO_NAME[courtId]}','${bookingDateUrlString}',${courtTime}`
          );
          const isAvailable = searchRegexExpression.test(availablePage);
          return isAvailable;
        }
      );

      const courtAvailableStrArray = isCourtAvailableArray.map((isAvailable) =>
        isAvailable ? 'O' : 'X'
      );

      const message = `
${bookingDateLogString} 場地查詢
           A B C D E F
19:00 ${courtAvailableStrArray[0]} ${courtAvailableStrArray[1]} ${courtAvailableStrArray[2]} ${courtAvailableStrArray[3]} ${courtAvailableStrArray[4]} ${courtAvailableStrArray[5]}
20:00 ${courtAvailableStrArray[6]} ${courtAvailableStrArray[7]} ${courtAvailableStrArray[8]} ${courtAvailableStrArray[9]} ${courtAvailableStrArray[10]} ${courtAvailableStrArray[11]}

(Debug)
發送時間: ${startTime}
回傳時間: ${searchTime}
`;
      console.log(message);

      this.notifier.sendNotification(message);
    } catch (error) {
      console.log(error);
    }
  }

  async getAvailableCourt(checkingCourts) {
    const bookingDate = add(new Date(), { days: 8 });
    const bookingDateUrlString = format(bookingDate, 'yyyy-MM-dd');

    try {
      const res = await fetch(
        `https://nd01.xuanen.com.tw/MobilePlace/MobilePlace?tFlag=2&PlaceType=1&SearchDate=${bookingDateUrlString}`,
        {
          method: 'GET',
          headers: {
            'User-Agent': this.userAgent,
            Cookie: `ASP.NET_SessionId=${this.session}`,
          },
        }
      );
      const availablePage = await res.text();

      const isCourtAvailableArray = checkingCourts.map(
        ({ courtId, courtTime }) => {
          const searchRegexExpression = new RegExp(
            `BookingCheck\\(${courtId},'羽${COURT_ID_TO_NAME[courtId]}','${bookingDateUrlString}',${courtTime}`
          );
          const isAvailable = searchRegexExpression.test(availablePage);
          return isAvailable;
        }
      );

      const availableCourts = checkingCourts.filter(
        (_, index) => isCourtAvailableArray[index]
      );
      console.log(availableCourts);
      return availableCourts;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async bookBadmintonCourt() {
    // in GMT+0, to book GMT+8, so 7+1
    const bookingDate = add(new Date(), { days: 8 });
    const bookingDateUrlString = format(bookingDate, 'yyyy-MM-dd');
    const bookingDateLogString = format(bookingDate, 'yyyy-MM-dd (iii)');

    this.bookingCourts.forEach(async ({ courtId, courtTime }) => {
      try {
        const startTime = formatInTimeZone(
          new Date(),
          'Asia/Taipei',
          'HH:mm:ss.SSS'
        );
        this.requestCount += 1;
        const { requestCount } = this;
        const res = await fetch(
          `https://nd01.xuanen.com.tw/MobilePlace/MobilePlace?tFlag=3&PlaceType=1&BookingPlaceID=${courtId}&BookingDate=${bookingDateUrlString}&BookingTime=${courtTime}`,
          {
            method: 'GET',
            headers: {
              'User-Agent': this.userAgent,
              Cookie: `ASP.NET_SessionId=${this.session}`,
            },
          }
        );
        this.responseCount += 1;
        const { responseCount } = this;
        const bookingTime = formatInTimeZone(
          new Date(),
          'Asia/Taipei',
          'HH:mm:ss.SSS'
        );

        const body = await res.text();
        const isSuccess = /預約成功/.test(body);

        const message = `
  ${this.name} ${isSuccess ? '預約成功' : '預約失敗'}
  ${bookingDateLogString} ${courtTime}:00 羽 ${COURT_ID_TO_NAME[courtId]}

  (Debug)
  發送時間: ${startTime}
  回傳時間: ${bookingTime}
  第 ${requestCount} 個請求 第 ${responseCount} 個回傳`;

        console.log(message);
        if (isSuccess) {
          this.notifier.sendNotification(message);
        }
      } catch (error) {
        console.log(error);
      }
    });
  }

  async login() {
    const formData = new FormData();
    formData.append('account', this.account);
    formData.append('pass', this.password);
    formData.append('AccountCheck', 'true');
    formData.append('isRemember', 'false');

    return fetch(`https://nd01.xuanen.com.tw/MobileLogin/MobileLogin?tFlag=1`, {
      method: 'POST',
      body: formData,
      headers: {
        'User-Agent': this.userAgent,
        Cookie: `ASP.NET_SessionId=${this.session}`,
      },
    })
      .then((res) => res.text())
      .then((body) => {
        const data = body.split(',');
        console.log(
          data[0] === '0' ? `${this.name} 登入成功` : `${this.name} 登入失敗`
        );
      });
  }

  async initializeBookingCourts(bookingCourts) {
    this.bookingCourts = await this.getAvailableCourt(bookingCourts);
  }
}

export default Person;
