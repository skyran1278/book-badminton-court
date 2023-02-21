const fetch = require('node-fetch');
const FormData = require('form-data');

const { people } = require('./config');

// 欺騙伺服器用
const userAgent =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1';

const login = async () =>
  Promise.all(
    people.map((person) => {
      const formData = new FormData();
      formData.append('account', person.account);
      formData.append('pass', person.password);
      formData.append('AccountCheck', 'true');
      formData.append('isRemember', 'false');

      return fetch(
        `https://nd01.xuanen.com.tw/MobileLogin/MobileLogin?tFlag=1`,
        {
          method: 'POST',
          body: formData,
          headers: {
            'User-Agent': userAgent,
            Cookie: `ASP.NET_SessionId=${person.session}`,
          },
        }
      )
        .then((res) => res.text())
        .then((body) => {
          const data = body.split(',');
          console.log(
            data[0] === '0'
              ? `${person.name} 登入成功`
              : `${person.name} 登入失敗`
          );
        });
    })
  );

module.exports = login;
