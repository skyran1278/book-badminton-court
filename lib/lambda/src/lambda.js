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

    const bookInterval = setInterval(bookBadmintonCourt, 100);
    return new Promise((resolve) => {
      setTimeout(() => {
        clearInterval(bookInterval);
        resolve();
      }, 80000);
    });
  } catch (error) {
    console.log(error);
    return error;
  }
};
