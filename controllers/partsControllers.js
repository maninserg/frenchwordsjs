const partsServices = require('../services/partsServices');

const getAllParts = async (req, res) => {
  const userId = req.session.user;
  const parts = await partsServices.getAllParts(userId);
  res.render('allparts', { parts, userId });
};

const getPartById = async (req, res) => {
  const partId = req.params.partId;
  const part = await partsServices.getPartById(partId);
  res.render('editpart', { part });
};

const createNewPartGet = async (req, res) => {
  res.render('addpart', { userId: req.session.user });
};

const createNewPartPost = async (req, res) => {
  const part = req.body.part;
  const description = req.body.description;
  const userId = req.session.user;
  await partsServices.createNewPart(part, description, userId);
  res.redirect('/allparts');
};

const updatePartByIdGet = async (req, res) => {
  const partId = req.params.partId;
  const part = await partsServices.getPartById(partId);
  res.render('editpart', { part });
};

const updatePartByIdPost = async (req, res) => {
  const partId = req.params.partId;
  const part = req.body.part;
  const description = req.body.description;
  await partsServices.updatePartById(partId, part, description);
  res.redirect(`/allparts`);
};

const deletePartById = async (req, res) => {
  partsServices.deletePartById(req.params.partId);
  res.redirect(`/allparts`);
};

module.exports = {
  getAllParts,
  getPartById,
  createNewPartGet,
  createNewPartPost,
  updatePartByIdGet,
  updatePartByIdPost,
  deletePartById,
};
