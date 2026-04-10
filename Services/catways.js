const Catway = require("../models/catway");

exports.getAll = async (req, res, next) => {
  try {
    let catways = await Catway.find();
    return res.status(200).json(catways);
  } catch (error) {
    return res.status(501).json(error);
  }
};

exports.getById = async (req, res, next) => {
  const id = parseInt(req.params.id);
  console.log("Tous les catways :", await Catway.find());
  try {
    let catway = await Catway.findOne({ catwayNumber: id });
    if (catway) {
      return res.status(200).json(catway);
    }
    return res.status(404).json("catway_not_found");
  } catch (error) {
    return res.status(501).json(error);
  }
};

exports.add = async (req, res, next) => {
  const temp = {
    catwayNumber: req.body.catwayNumber,
    catwayType: req.body.catwayType,
    catwayState: req.body.catwayState,
  };
  try {
    let catway = await Catway.create(temp);
    return res.status(201).json(catway);
  } catch (error) {
    return res.status(501).json(error);
  }
};

exports.update = async (req, res, next) => {
  const id = req.params.id;
  try {
    let catway = await Catway.findOne({ catwayNumber: id });
    if (catway) {
      // On met à jour UNIQUEMENT catwayState
      catway.catwayState = req.body.catwayState;
      await catway.save();
      return res.status(200).json(catway);
    }
    return res.status(404).json("catway_not_found");
  } catch (error) {
    return res.status(501).json(error);
  }
};

exports.delete = async (req, res, next) => {
  const id = req.params.id;
  try {
    await Catway.deleteOne({ catwayNumber: id });
    return res.status(204).json("delete_ok");
  } catch (error) {
    return res.status(501).json(error);
  }
};

// Fonctions pour les pages EJS
exports.getAllCatways = async () => {
  return await Catway.find();
};

exports.getCatwayById = async (id) => {
  return await Catway.findById(id);
};

exports.createCatway = async (data) => {
  const catway = new Catway(data);
  return await catway.save();
};

exports.updateCatway = async (id, data) => {
  return await Catway.findByIdAndUpdate(id, { $set: data }, { new: true });
};

exports.deleteCatway = async (id) => {
  return await Catway.findByIdAndDelete(id);
};
