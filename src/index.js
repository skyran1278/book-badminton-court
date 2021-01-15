const { CronJob } = require('cron');
const fetch = require('node-fetch');
const FormData = require('form-data');
const add = require('date-fns/add');
const format = require('date-fns/format');

const { people, bookCourts } = require('./config');

// 欺騙伺服器用
const userAgent =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1';

const loginJob = new CronJob('50 59 23 * * 4', () => {
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
});

const bookBadmintonCourtJob = new CronJob('00 00 00 * * 5', () => {
  const bookDate = format(add(new Date(), { days: 7 }), 'yyyy-MM-dd');

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
      .then((body) =>
        console.log(
          /預約成功/.test(body)
            ? `${court} ${time} 預約成功`
            : `${court} ${time} 預約失敗\n${body}`
        )
      );
  });
});

bookBadmintonCourtJob.start();
loginJob.start();

console.log('cron started');
