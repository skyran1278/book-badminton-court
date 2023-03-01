const add = require('date-fns/add');
const format = require('date-fns/format');
const fetch = require('node-fetch');
const { courtIdNamePair, people, lineBearerToken } = require('./config');

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

  const courtIdAndTimes = [
    { courtId: courtIdNamePair.A, courtTime: '19' },
    { courtId: courtIdNamePair.B, courtTime: '19' },
    { courtId: courtIdNamePair.C, courtTime: '19' },
    { courtId: courtIdNamePair.D, courtTime: '19' },
    { courtId: courtIdNamePair.E, courtTime: '19' },
    { courtId: courtIdNamePair.F, courtTime: '19' },
    { courtId: courtIdNamePair.A, courtTime: '20' },
    { courtId: courtIdNamePair.B, courtTime: '20' },
    { courtId: courtIdNamePair.C, courtTime: '20' },
    { courtId: courtIdNamePair.D, courtTime: '20' },
    { courtId: courtIdNamePair.E, courtTime: '20' },
    { courtId: courtIdNamePair.F, courtTime: '20' },
  ];

  const isAvailableOrNotMessages = courtIdAndTimes.map(
    ({ courtId, courtTime }) => {
      const searchRegexExpression = new RegExp(
        `BookingCheck\\(${courtId},'羽${courtIdNamePair[courtId]}','${bookDate}',${courtTime}`
      );
      const isAvailable = searchRegexExpression.test(availablePage);
      const isAvailableOrNotMessage = isAvailable ? 'O' : 'X';
      return isAvailableOrNotMessage;
    }
  );

  const message = `
${bookDate} 場地查詢
           A B C D E F
19:00 ${isAvailableOrNotMessages[0]} ${isAvailableOrNotMessages[1]} ${isAvailableOrNotMessages[2]} ${isAvailableOrNotMessages[3]} ${isAvailableOrNotMessages[4]} ${isAvailableOrNotMessages[5]}
20:00 ${isAvailableOrNotMessages[6]} ${isAvailableOrNotMessages[7]} ${isAvailableOrNotMessages[8]} ${isAvailableOrNotMessages[9]} ${isAvailableOrNotMessages[10]} ${isAvailableOrNotMessages[11]}
`;
  console.log(message);

  return fetch(`https://notify-api.line.me/api/notify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${lineBearerToken}`,
    },
    body: new URLSearchParams({ message }),
  }).then((res) => res.json());
};

module.exports = isCourtAvailable;
