import { job } from 'cron';
import zipWith from 'lodash/zipWith.js';

import { COURT_NAME_TO_ID } from './config.js';
import { Notifier } from './Notifier.js';
import { Person } from './Person.js';

function createPeople(names, sessions, accounts, passwords) {
  if (
    names.length !== sessions.length ||
    names.length !== accounts.length ||
    names.length !== passwords.length
  ) {
    throw Error('names sessions accounts passwords 數量不對等');
  }

  const notifier = new Notifier();

  return zipWith(
    names,
    sessions,
    accounts,
    passwords,
    (name, session, account, password) =>
      new Person({
        name,
        session,
        account,
        password,
        notifier,
      })
  );
}

async function logInPeople(people) {
  await Promise.all(people.map((person) => person.login()));
}

function bookInterval(people, timeout) {
  // while
  // 失敗
  // 使用 while loop 會有 JavaScript heap out of memory 的問題
  // let continueLoop = true;

  // setTimeout(() => {
  //   continueLoop = false;
  // }, timeout); // Wait for 5 seconds (5000 milliseconds)

  // while (continueLoop) {
  //   // Your loop content here
  //   // Keep in mind that this loop might still block the main thread if it contains resource-intensive tasks
  //   people.forEach((person) => person.bookBadmintonCourt());
  // }

  // 間隔 1000
  // 預估最多 15 10
  // 測試結果 12  8
  // 1 秒內回傳
  // 測試結果  2  2
  // 2 秒內回傳
  // 測試結果  4  2

  // 間隔 100
  // 預估最多 150 100
  // 測試結果 147  98
  // 1 秒內回傳
  // 測試結果  20  20
  // 2 秒內回傳
  // 測試結果  17  13

  // 間隔 10
  //
  // 開發環境
  // 預估最多 1500 1000
  // 測試結果 1467  978
  // 1 秒內回傳
  // 測試結果   31   31
  // 2 秒內回傳
  // 測試結果   32   29
  //
  // 生產環境
  // 1 秒內回傳 12
  // 2 秒內回傳 13

  // 間隔 5
  // 開始出現失敗
  // 預估最多 3000 2000
  // 測試結果 1995 1329
  // 1 秒內回傳
  // 測試結果    1    0
  // 2 秒內回傳
  // 測試結果    0    0
  const interval = setInterval(
    () => people.forEach((person) => person.bookBadmintonCourt()),
    20 // 太短時間不一定好
  );
  setTimeout(() => {
    clearInterval(interval);
  }, timeout);
}

function waitForCompletion() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 60000);
  });
}

export async function booking() {
  try {
    const names = process.env.NAMES.split(' ');
    const sessions = process.env.SESSIONS.split(' ');
    const accounts = process.env.ACCOUNTS.split(' ');
    const passwords = process.env.PASSWORDS.split(' ');

    const people = createPeople(names, sessions, accounts, passwords);

    // validatePeople
    if (people.length === 0) {
      throw new Error('No people');
    }
    if (people.length !== 2) {
      throw new Error('Should have two people');
    }

    await logInPeople(people);

    // initializeBookingCourts
    people[0].bookingCourts = await people[0].getAvailableCourt([
      { courtId: COURT_NAME_TO_ID.A, courtTime: '19' },
      { courtId: COURT_NAME_TO_ID.B, courtTime: '19' },
      { courtId: COURT_NAME_TO_ID.C, courtTime: '19' },
      { courtId: COURT_NAME_TO_ID.D, courtTime: '19' },
      { courtId: COURT_NAME_TO_ID.E, courtTime: '19' },
      { courtId: COURT_NAME_TO_ID.F, courtTime: '19' },
    ]);

    people[1].bookingCourts = await people[1].getAvailableCourt([
      { courtId: COURT_NAME_TO_ID.A, courtTime: '20' },
      { courtId: COURT_NAME_TO_ID.B, courtTime: '20' },
      { courtId: COURT_NAME_TO_ID.C, courtTime: '20' },
      { courtId: COURT_NAME_TO_ID.D, courtTime: '20' },
      { courtId: COURT_NAME_TO_ID.E, courtTime: '20' },
      { courtId: COURT_NAME_TO_ID.F, courtTime: '20' },
    ]);

    job({
      cronTime: '56 59 * * * *',
      onTick: () => bookInterval(people, 5000),
      start: true,
    });

    job({
      cronTime: '50 59 * * * *',
      onTick: () => people[0].sendCourtAvailableNotification(),
      start: true,
    });

    job({
      cronTime: '2 0 * * * *',
      onTick: () => people[0].sendCourtAvailableNotification(),
      start: true,
    });

    return waitForCompletion();
  } catch (error) {
    console.log(error);
    return error;
  }
}

export default booking;
