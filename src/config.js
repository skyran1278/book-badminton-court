const courts = {
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
  bookCourts: [
    { person: people.paul, court: courts.D, time: 19 },
    { person: people.paul, court: courts.D, time: 19 },
    { person: people.ariel, court: courts.F, time: 19 },
    { person: people.ariel, court: courts.F, time: 20 },
  ],
  people,
  courts,
};
