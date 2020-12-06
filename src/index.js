const { CronJob } = require('cron');
const fetch = require('node-fetch');

const courts = {
  A: 83,
  B: 84,
  C: 1074,
  D: 1075,
  E: 87,
  F: 2225,
};

const date = '2020-12-13';
const time = '19';
const people = {
  paul: process.env.PAUL,
};

const catchBadmintonCourtJob = new CronJob('0 38 11 * * *', () => {
  fetch(
    `http://nd01.allec.com.tw/MobilePlace/MobilePlace?tFlag=3&PlaceType=1&BookingPlaceID=${courts.A}&BookingDate=${date}&BookingTime=${time}`,
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
        Cookie: `ASP.NET_SessionId=${people.paul}`,
      },
    }
  )
    .then((res) => res.text())
    .then((body) => console.log(body));
});

catchBadmintonCourtJob.start();
