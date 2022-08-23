const { job } = require('cron');

const bookBadmintonCourt = require('../src/bookBadmintonCourt');
const login = require('../src/login');
const { bookDay } = require('../src/config');

job({
  cronTime: `50 59 23 * * ${bookDay - 1}`,
  onTick: login,
  start: true,
  runOnInit: true,
});

[
  `59 59 23 * * ${bookDay - 1}`,
  `00 00 00 * * ${bookDay}`,
  `01 00 00 * * ${bookDay}`,
].map((cronTime) =>
  job({
    cronTime,
    onTick: bookBadmintonCourt,
    start: true,
    runOnInit: true,
  })
);

console.log('cron started');
