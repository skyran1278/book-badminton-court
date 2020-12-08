const courts = {
  A: 83,
  B: 84,
  C: 1074,
  D: 1075,
  E: 87,
  F: 2225,
};

const people = {
  paul: {
    session: process.env.PAUL_SESSION,
    account: process.env.PAUL_ACCOUNT,
    password: process.env.PAUL_PASSWORD,
  },
  ariel: {
    session: process.env.ARIEL_SESSION,
    account: process.env.ARIEL_ACCOUNT,
    password: process.env.ARIEL_PASSWORD,
  },
};

module.exports = {
  // 每次需要修改的地方
  date: '2020-12-18',
  catchCourts: [
    { person: people.paul, court: courts.C, time: 19 },
    { person: people.paul, court: courts.C, time: 20 },
    { person: people.ariel, court: courts.F, time: 19 },
    { person: people.ariel, court: courts.F, time: 20 },
  ],
  people,
};
