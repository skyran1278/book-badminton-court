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
  const interval = setInterval(
    () => people.forEach((person) => person.bookBadmintonCourt()),
    100 // 太短時間的話會被系統擋掉
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
      cronTime: '55 * * * * *',
      onTick: () => bookInterval(people, 5000),
      start: true,
    });

    job({
      cronTime: '54,59,0 * * * * *',
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
