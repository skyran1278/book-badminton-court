const add = require('date-fns/add');
const format = require('date-fns/format');
const fetch = require('node-fetch');
const {
  courtIdAndTimes,
  courtIdNamePair,
  people,
  lineBearerToken,
} = require('./config');

const userAgent =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1';

const bookBadmintonCourt = () => {
  // in GMT+0, to book GMT+8, so 7+1
  const bookDate = format(add(new Date(), { days: 8 }), 'yyyy-MM-dd');
  const startTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss.SSX');

  courtIdAndTimes.forEach(({ courtId, courtTime }) => {
    people.forEach((person) => {
      fetch(
        `http://nd01.allec.com.tw/MobilePlace/MobilePlace?tFlag=3&PlaceType=1&BookingPlaceID=${courtId}&BookingDate=${bookDate}&BookingTime=${courtTime}`,
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
          const bookingTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss.SSX');
          const isSuccess = /預約成功/.test(body);
          const successOrFailMessage = isSuccess ? '預約成功' : '預約失敗';
          const message = `
${person.name} ${successOrFailMessage}
場地時間: ${bookDate} ${courtTime} ${courtIdNamePair[courtId]}

(Debug)
發送時間: ${startTime}
回傳時間: ${bookingTime}`;
          console.log(message);
          console.log(body);
          if (isSuccess) {
            fetch(`https://notify-api.line.me/api/notify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Bearer ${lineBearerToken}`,
              },
              body: new URLSearchParams({ message }),
            });
          }
        });
    });
  });
};

module.exports = bookBadmintonCourt;
