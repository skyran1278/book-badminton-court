const { CronJob } = require('cron');
const fetch = require('node-fetch');
const FormData = require('form-data');

const courts = {
  A: 83,
  B: 84,
  C: 1074,
  D: 1075,
  E: 87,
  F: 2225,
};
const people = {
  paul: process.env.PAUL,
};

// 每次需要修改的地方
const date = '2020-12-13';
const catchCourts = [
  { person: people.paul, court: courts.A, time: 19 },
  // { person: people.paul, court: courts.A, time: 20 },
];

const loginJob = new CronJob('0 43 14 * * *', () => {
  Object.entries(people).forEach(([_, person]) => {
    fetch(`http://nd01.allec.com.tw/MobileLogin/MobileLogin?tFlag=1`, {
      method: 'POST',
      body: formData,
    }).then((res) => res.text());
  });
});

const catchBadmintonCourtJob = new CronJob('0 44 14 * * *', () => {
  catchCourts.forEach(({ court, time, person }) => {
    fetch(
      `http://nd01.allec.com.tw/MobilePlace/MobilePlace?tFlag=3&PlaceType=1&BookingPlaceID=${court}&BookingDate=${date}&BookingTime=${time}`,
      {
        method: 'GET',
        headers: {
          Host: 'nd01.allec.com.tw',
          Connection: 'keep-alive',
          'Upgrade-Insecure-Requests': 1,
          'User-Agent':
            'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
          Referer:
            'http://nd01.allec.com.tw/MobilePlace/MobilePlace?tFlag=2&PlaceType=1',
          'Accept-Encoding': 'gzip, deflate',
          'Accept-Language': 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7,zh-CN;q=0.6',
          Cookie: `ASP.NET_SessionId=${person}`,
        },
      }
    )
      .then((res) => res.text())
      .then((body) => console.log(body));
  });
});

catchBadmintonCourtJob.start();
loginJob.start();

Object.entries(people).forEach(([_, person]) => {
  fetch(`http://nd01.allec.com.tw/MobileLogin/MobileLogin?tFlag=1`, {
    method: 'POST',
    body: formData,
  })
    .then((res) => res.text())
    .then((body) => {
      const data = body.split(',');
      console.log(data[0], data[1]);
    });
});

catchCourts.forEach(({ court, time, person }) => {
  fetch(
    `http://nd01.allec.com.tw/MobilePlace/MobilePlace?tFlag=3&PlaceType=1&BookingPlaceID=${court}&BookingDate=${date}&BookingTime=${time}`,
    {
      method: 'GET',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
        Cookie: `ASP.NET_SessionId=${person}`,
      },
    }
  )
    .then((res) => res.text())
    .then((body) => console.log(body));
});
