const Word = require('../models/words');
const Translate = require('../models/translates');
const Part = require('../models/parts');
const User = require('../models/users');

async function getUserById(userId) {
  const user = await User.findOne({
    where: {
      id: userId,
    },
  });
  return user;
}

async function getUserByUsername(userName) {
  const user = await User.findOne({
    where: {
      username: userName,
    },
  });
  return user;
}

module.exports = { getUserById, getUserByUsername };
