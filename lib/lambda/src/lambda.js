const { job } = require('cron');

const bookingBadmintonCourt = require('./bookingBadmintonCourt');
const login = require('./login');
const isCourtAvailable = require('./isCourtAvailable');

// 為了簡化，將兩件事合併在同一個 lambda
// 先 bookBadmintonCourt 因為要搶時間
// 第一次會先失敗、然後 login
// 第二次會成功
exports.booking = async () => {
  try {
    await login();

    const bookInterval = () => {
      const interval = setInterval(bookingBadmintonCourt, 10);
      setTimeout(() => {
        clearInterval(interval);
      }, 3000);
    };

    job({
      cronTime: '56 * * * * *',
      onTick: bookInterval,
      start: true,
    });

    job({
      cronTime: '0,54,59 * * * * *',
      onTick: isCourtAvailable,
      start: true,
    });

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 60000);
    });
  } catch (error) {
    console.log(error);
    return error;
  }
};
