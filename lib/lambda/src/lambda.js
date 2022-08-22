const bookBadmintonCourt = require('./bookBadmintonCourt');
const login = require('./login');

// 為了簡化，將兩件事合併在同一個 lambda
// 先 bookBadmintonCourt 因為要搶時間
// 第一次會先失敗、然後 login
// 第二次會成功
exports.booking = () => {
  login();
  const bookInterval = setInterval(bookBadmintonCourt, 1000);
  setTimeout(() => {
    clearInterval(bookInterval);
  }, 60000);
};
