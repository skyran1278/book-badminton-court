const add = require('date-fns/add');
const format = require('date-fns/format');
const fetch = require('node-fetch');
const { bookCourts, courts } = require('./config');

const userAgent =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1';

const bookBadmintonCourt = () => {
  const bookDate = format(add(new Date(), { days: 7 }), 'yyyy-MM-dd');
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
            ? `${bookDate} ${person.account} ${courts[court]} ${time} 預約成功 ${startTime} ${bookingTime}`
            : `${bookDate} ${person.account} ${courts[court]} ${time} 預約失敗 ${startTime} ${bookingTime}`
        );
      });
  });
};

module.exports = bookBadmintonCourt;
