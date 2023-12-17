const Word = require('./words');
const Translate = require('./translates');
const Example = require('./examples');
const Part = require('./parts');
const User = require('./users');
const db = require('../db.js');

async function create_tables() {
  try {
    await db.authenticate();
    await db.sync({ force: true });
  } catch (e) {
    console.log(e);
  } finally {
    db.close();
  }
}

create_tables();
