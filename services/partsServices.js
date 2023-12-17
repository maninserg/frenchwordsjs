const Word = require('../models/words');
const Part = require('../models/parts');

async function getAllParts(userId) {
  const parts = await Part.findAll({
    where: {
      userId: userId,
    },
  });
  return parts;
}

async function getPartById(partId) {
  const part = await Part.findOne({
    where: {
      id: partId,
    },
  });
  return part;
}

async function getPartByName(name) {
  const part = await Part.findOne({
    where: {
      part: name,
    },
  });
  return part;
}

async function createNewPart(part, description, userId) {
  const partFromBd = await getPartByName(part);
  console.log(part, partFromBd);
  if (!partFromBd) {
    await Part.create({
      part: part,
      description: description,
      userId: userId,
    });
  }
}

async function updatePartById(partId, part, description) {
  const partOld = await getPartById(partId);
  partOld.set({
    part: part,
    description: description,
  });
  await partOld.save();
}

async function deletePartById(partId) {
  await Part.destroy({
    where: {
      id: partId,
    },
  });
}

module.exports = {
  getAllParts,
  getPartById,
  createNewPart,
  updatePartById,
  deletePartById,
};

//getAllParts(1);
