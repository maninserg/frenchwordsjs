const wordsServices = require('../services/wordsServices');
const partsServices = require('../services/partsServices');
const translatesServices = require('../services/translatesServices');

const getAllWords = async (req, res) => {
  const userId = req.session.user;
  const words = await wordsServices.getAllWords(userId);
  res.render('allwords', { words });
};

const createNewWordGet = async (req, res) => {
  const userId = req.session.user;
  const parts = await partsServices.getAllParts(userId);
  const translates = await translatesServices.getAllTranslates(userId);
  res.render('addword', { parts, translates });
};

const createNewWordPost = async (req, res) => {
  const word = req.body.word;
  const ipa_str = req.body.ipa_str;
  const partId = req.body.partId;
  const translateId = req.body.translateId;
  const userId = req.session.user;
  await wordsServices.createNewWord(word, ipa_str, partId, translateId, userId);
  res.redirect('/allwords');
};

const updateWordByIdGet = async (req, res) => {
  const wordId = req.params.wordId;
  const word = await wordsServices.getWordById(wordId);
  const parts = await partsServices.getAllParts(word.userId);
  const translates = await translatesServices.getAllTranslates(word.userId);
  res.render('editword', {
    word,
    parts,
    translates,
    userId: word.userId,
  });
};

const updateWordByIdPost = async (req, res) => {
  const wordId = req.params.wordId;
  const word = req.body.word;
  const ipa_str = req.body.ipa_str;
  const partId = req.body.partId;
  await wordsServices.updateWordById(wordId, word, ipa_str, partId);
  res.redirect('/allwords');
};

const deleteWordById = async (req, res) => {
  const wordId = req.params.wordId;
  await wordsServices.deleteWordById(wordId);
  res.redirect(`/allwords`);
};

const cardWord = async (req, res) => {
  const userId = req.session.user;
  const wordId = req.params.wordId;
  const word = await wordsServices.getWordById(wordId);
  const part = await partsServices.getPartById(word.partId);
  const translates = await translatesServices.getAllTranslatesByWordId(word.id);
  const randId = await wordsServices.getRandomIdWord(userId);
  res.render('oneword', { word, part, translates, randId });
};

const getAllTranslatesByWordIdAndUserId = async (req, res) => {
  const wordId = req.params.wordId;
  const word = await wordsServices.getWordById(wordId);
  const translatesbyword = await translatesServices.getAllTranslatesByWordId(
    word.id
  );
  const translatesbyuser = await translatesServices.getAllTranslates(
    word.userId
  );
  res.render('wordtranslates', { word, translatesbyword, translatesbyuser });
};

const createTranslateToWord = async (req, res) => {
  const wordId = req.params.wordId;
  const translateId = req.body.translateId;
  const translate = await translatesServices.getTranslateById(translateId);
  translate.set({
    wordId: wordId,
  });
  await translate.save();
  res.redirect(`/editword/${wordId}/translates`);
};

const deleteTranslateFromWord = async (req, res) => {
  const translateId = req.params.translateId;
  const translate = await translatesServices.getTranslateById(translateId);
  translate.set({
    wordId: worId,
  });
  await translate.save();
  res.redirect(`/editword/${req.params.wordId}/translates`);
};

module.exports = {
  getAllWords,
  createNewWordGet,
  createNewWordPost,
  updateWordByIdGet,
  updateWordByIdPost,
  deleteWordById,
  cardWord,
  getAllTranslatesByWordIdAndUserId,
  createTranslateToWord,
  deleteTranslateFromWord,
};
