const Word = require('../models/words');
const Translate = require('../models/translates');
const Part = require('../models/parts');
const User = require('../models/users');
const translatesServices = require('./translatesServices');

async function getAllWords(userId) {
  const words = await Word.findAll({
    where: {
      userId: userId,
    },
    include: Part,
  });
  return words;
}

async function getWordById(wordId) {
  const word = await Word.findOne({
    where: {
      id: wordId,
    },
  });
  return word;
}

async function createNewWord(word, ipa_str, partId, translateId, userId) {
  const newWord = await Word.create({
    word: word || null,
    ipa_str: ipa_str || null,
    forvo_link: `https://forvo.com/word/${word}/#fr` || null,
    partId: partId || null,
    userId: userId || null,
  });
  const translate = await translatesServices.getTranslateById(translateId);
  translate.set({
    wordId: word.id,
  });
  await translate.save();
}

async function updateWordById(wordId, word, ipa_str, partId) {
  const wdOld = await getWordById(wordId);
  wdOld.set({
    word: word,
    ipa_str: ipa_str,
    forvo_link: `https://forvo.com/word/${word}/#fr`,
    partId: partId,
  });
  await wdOld.save();
}

async function deleteWordById(wordId) {
  await Word.destroy({
    where: {
      id: wordId,
    },
  });
}

async function getRandomIdWord(userId) {
  const words = await getAllWords(userId);
  const randWordArr = words[randomNumber(words.length - 1)];
  const randId = randWordArr.id;
  return randId;
}

function randomNumber(maxN) {
  const minN = 0;
  const randomN = Math.floor(minN + Math.random() * (maxN + 1 - minN));
  return randomN;
}

module.exports = {
  getAllWords,
  getWordById,
  createNewWord,
  updateWordById,
  deleteWordById,
  getRandomIdWord,
};
