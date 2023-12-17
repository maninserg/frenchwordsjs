const translatesServices = require('../services/translatesServices');

const getAllTranslates = async (req, res) => {
  const userId = req.session.user;
  const translates = await translatesServices.getAllTranslates(userId);
  res.render('alltranslates', { translates });
};

const createNewTranslateGet = async (req, res) => {
  res.render('addtranslate');
};
const createNewTranslatePost = async (req, res) => {
  const translate = req.body.translate;
  const userId = req.session.user;
  await translatesServices.createNewTranslate(translate, userId);
  res.redirect(`/alltranslates`);
};

const updateTranslateByIdGet = async (req, res) => {
  const translateId = req.params.translateId;
  const translate = await translatesServices.getTranslateById(translateId);
  res.render('edittranslate', { translate });
};

const updateTranslateByIdPost = async (req, res) => {
  const translateId = req.params.translateId;
  const translate = req.body.translate;
  await translatesServices.updateTranslateById(translate, translateId);
  res.redirect(`/alltranslates`);
};

const deleteTranslateById = async (req, res) => {
  const translateId = req.params.translateId;
  await translatesServices.deleteTranslateById(translateId);
  res.redirect(`/alltranslates`);
};

module.exports = {
  getAllTranslates,
  createNewTranslateGet,
  createNewTranslatePost,
  updateTranslateByIdGet,
  updateTranslateByIdPost,
  deleteTranslateById,
};
