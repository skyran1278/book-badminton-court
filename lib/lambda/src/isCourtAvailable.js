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

const isCourtAvailable = async () => {
  const bookDate = format(add(new Date(), { days: 8 }), 'yyyy-MM-dd');
  const availablePage = await fetch(
    `https://nd01.xuanen.com.tw/MobilePlace/MobilePlace?tFlag=2&PlaceType=1&SearchDate=${bookDate}`,
    {
      method: 'GET',
      headers: {
        'User-Agent': userAgent,
        Cookie: `ASP.NET_SessionId=${people[0].session}`,
      },
    }
  ).then((res) => res.text());

  courtIdAndTimes.forEach(({ courtId, courtTime }) => {
    const searchRegexExpression = new RegExp(
      `BookingCheck\\(${courtId},'羽${courtIdNamePair[courtId]}','${bookDate}',${courtTime}`
    );
    const isAvailable = searchRegexExpression.test(availablePage);
    const isAvailableOrNotMessage = isAvailable ? '可預約' : '不可預約';

    const message = `${bookDate} ${courtTime} ${courtIdNamePair[courtId]} ${isAvailableOrNotMessage}`;
    console.log(message);

    fetch(`https://notify-api.line.me/api/notify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${lineBearerToken}`,
      },
      body: new URLSearchParams({ message }),
    });
  });
};

module.exports = isCourtAvailable;
