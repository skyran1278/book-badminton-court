const { CronJob } = require('cron');
const fetch = require('node-fetch');
const FormData = require('form-data');
const add = require('date-fns/add');
const format = require('date-fns/format');

const { people, bookCourts, courts } = require('./config');

// 欺騙伺服器用
const userAgent =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1';

let bookDate = format(add(new Date(), { days: 7 }), 'yyyy-MM-dd');

const login = () => {
  Object.entries(people).forEach(([name, person]) => {
    const formData = new FormData();
    formData.append('account', person.account);
    formData.append('pass', person.password);
    formData.append('AccountCheck', 'true');
    formData.append('isRemember', 'false');

    fetch(`http://nd01.allec.com.tw/MobileLogin/MobileLogin?tFlag=1`, {
      method: 'POST',
      body: formData,
      headers: {
        'User-Agent': userAgent,
        Cookie: `ASP.NET_SessionId=${person.session}`,
      },
    })
      .then((res) => res.text())
      .then((body) => {
        const data = body.split(',');
        console.log(data[0] === '0' ? `${name} 登入成功` : `${name} 登入失敗`);
      });
  });
};

const bookBadmintonCourt = () => {
  const startTime = format(new Date(), 'yyyy-MM-dd-HH-mm-ss-SSS');

  bookCourts.forEach(({ court, time, person }) => {
    fetch(
      `http://nd01.allec.com.tw/MobilePlace/MobilePlace?tFlag=3&PlaceType=1&BookingPlaceID=${court}&BookingDate=${bookDate}&BookingTime=${time}`,
      {
        method: 'GET',
        headers: {
          'User-Agent': userAgent,
          Cookie: `ASP.NET_SessionId=${person.session}`,
        },
      }
    )
      .then((res) => res.text())
      .then((body) => {
        const bookingTime = format(new Date(), 'yyyy-MM-dd-HH-mm-ss-SSS');
        console.log(
          /預約成功/.test(body)
            ? `${bookDate} ${courts[court]} ${time} 預約成功 ${startTime} ${bookingTime}`
            : `${bookDate} ${courts[court]} ${time} 預約失敗 ${startTime} ${bookingTime}`
        );
      });
  });
};

const loginJob = new CronJob('50 59 23 * * 4', () => {
  bookDate = format(add(new Date(), { days: 8 }), 'yyyy-MM-dd');
  login();
});

const bookBadmintonCourtJobs = [
  '59 59 23 * * 4',
  '00 00 00 * * 5',
  '01 00 00 * * 5',
  '02 00 00 * * 5',
  '05 00 00 * * 5',
  '10 00 00 * * 5',
].map((cronTime) => new CronJob(cronTime, bookBadmintonCourt));

loginJob.start();
bookBadmintonCourtJobs.forEach((job) => job.start());

console.log('cron started');
