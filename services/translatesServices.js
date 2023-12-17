const Word = require('../models/words');
const Translate = require('../models/translates');

async function getAllTranslates(userId) {
  const translates = await Translate.findAll({
    where: {
      userId: userId,
    },
  });
  return translates;
}

async function getTranslateById(translateId) {
  const translate = await Translate.findOne({
    where: {
      id: translateId,
    },
  });
  return translate;
}

async function getAllTranslatesByWordId(wordId) {
  const translates = await Translate.findAll({
    where: {
      wordId: wordId,
    },
  });
  return translates;
}

async function createNewTranslate(translate, userId) {
  await Translate.create({
    translate: translate,
    userId: userId,
  });
}

async function updateTranslateById(translate, translateId) {
  const translateOld = await getTranslateById(translateId);
  translateOld.set({
    translate: translate,
  });
  await translateOld.save();
}

async function deleteTranslateById(translateId) {
  await Translate.destroy({
    where: {
      id: translateId,
    },
  });
}

module.exports = {
  getAllTranslates,
  getTranslateById,
  getAllTranslatesByWordId,
  createNewTranslate,
  updateTranslateById,
  deleteTranslateById,
};
