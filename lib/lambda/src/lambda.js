const { job } = require('cron');

const bookBadmintonCourt = require('./bookBadmintonCourt');
const login = require('./login');
const isCourtAvailable = require('./isCourtAvailable');

// 為了簡化，將兩件事合併在同一個 lambda
// 先 bookBadmintonCourt 因為要搶時間
// 第一次會先失敗、然後 login
// 第二次會成功
exports.booking = async () => {
  try {
    await login();
    await isCourtAvailable();

    // const bookInterval = () => setInterval(bookBadmintonCourt, 1);
    // job({
    //   cronTime: '58 * * * * *',
    //   onTick: bookInterval,
    //   start: true,
    // });

    job({
      cronTime: '55-59,0-5 * * * * *',
      onTick: bookBadmintonCourt,
      start: true,
    });

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 70000);
    });
  } catch (error) {
    console.log(error);
    return error;
  }
};
