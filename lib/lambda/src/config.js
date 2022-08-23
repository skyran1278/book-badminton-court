const zipWith = require('lodash/zipWith');

const courtIdNamePair = {
  A: 83,
  B: 84,
  C: 1074,
  D: 1075,
  E: 87,
  F: 2225,
  83: 'A',
  84: 'B',
  1074: 'C',
  1075: 'D',
  87: 'E',
  2225: 'F',
};

const sessions = process.env.SESSIONS.split(' ');
const accounts = process.env.ACCOUNTS.split(' ');
const passwords = process.env.PASSWORDS.split(' ');
const courtNames = process.env.COURT_NAMES.split(' ');
const courtTimes = process.env.COURT_TIMES.split(' ');
const lineBearerToken = process.env.LINE_BEARER_TOKEN;

if (
  sessions.length !== accounts.length ||
  sessions.length !== passwords.length
) {
  throw Error('sessions accounts passwords 數量不對等');
}

const courtIds = courtNames.map((court) => courtIdNamePair[court]);
if (courtIds.some((courtId) => courtId === undefined)) {
  throw Error('場地名稱錯誤');
}

const people = zipWith(
  sessions,
  accounts,
  passwords,
  (session, account, password) => ({
    session,
    account,
    password,
  })
);

module.exports = {
  courtIdAndTimes: zipWith(courtIds, courtTimes, (courtId, courtTime) => ({
    courtId,
    courtTime,
  })),
  people,
  courtIdNamePair,
  lineBearerToken,
};
