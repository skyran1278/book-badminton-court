const add = require('date-fns/add');
const format = require('date-fns/format');
const fetch = require('node-fetch');
const { formatInTimeZone } = require('date-fns-tz');
const { courtIdNamePair, people, lineBearerToken } = require('./config');

const userAgent =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1';

// 這裡分成三個部分
// 1. fetch data
// 2. parse data
// 3. log data
const isCourtAvailable = async (timeArray) => {
  const bookingDate = add(new Date(), { days: 8 });
  const bookingDateUrlString = format(bookingDate, 'yyyy-MM-dd');
  const bookingDateLogString = format(bookingDate, 'yyyy-MM-dd (iii)');
  const startTime = formatInTimeZone(new Date(), 'Asia/Taipei', 'HH:mm:ss.SSS');
  const availablePage = await fetch(
    `https://nd01.xuanen.com.tw/MobilePlace/MobilePlace?tFlag=2&PlaceType=1&SearchDate=${bookingDateUrlString}`,
    {
      method: 'GET',
      headers: {
        'User-Agent': userAgent,
        Cookie: `ASP.NET_SessionId=${people[0].session}`,
      },
    }
  ).then((res) => res.text());
  const searchTime = formatInTimeZone(
    new Date(),
    'Asia/Taipei',
    'HH:mm:ss.SSS'
  );

  const isCourtAvailableArray = courtIdAndTimes.map(
    ({ courtId, courtTime }) => {
      const searchRegexExpression = new RegExp(
        `BookingCheck\\(${courtId},'羽${courtIdNamePair[courtId]}','${bookingDateUrlString}',${courtTime}`
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

  await fetch(`https://notify-api.line.me/api/notify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${lineBearerToken}`,
    },
    body: new URLSearchParams({ message }),
  }).then((res) => res.json());

  return courtIdAndTimes.filter((_, index) => isCourtAvailableArray[index]);
};

module.exports = isCourtAvailable;
