const Catway = require("../models/catway");

/**
 * Récupère tous les catways
 * @route GET /catways
 * @returns {Object[]} Liste des catways
 */
exports.getAll = async (req, res, next) => {
  try {
    let catways = await Catway.find();
    return res.status(200).json(catways);
  } catch (error) {
    return res.status(501).json(error);
  }
};

/**
 * Récupère un catway par son numéro
 * @route GET /catways/:id
 * @param {Object} req - Requête Express
 * @param {Object} req.params - Paramètres de route
 * @param {string} req.params.id - Numéro du catway
 * @returns {Object} Catway trouvé
 * @returns {string} Message d'erreur si non trouvé
 */
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

/**
 * Crée un nouveau catway
 * @route POST /catways
 * @param {Object} req.body - Données du catway
 * @param {number} req.body.catwayNumber - Numéro du catway
 * @param {string} req.body.catwayType - Type du catway
 * @param {string} req.body.catwayState - État du catway
 * @returns {Object} Catway créé
 */
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

/**
 * Met à jour l'état d'un catway
 * @route PUT /catways/:id
 * @param {Object} req.params - Paramètres de route
 * @param {string} req.params.id - Numéro du catway
 * @param {Object} req.body - Données à mettre à jour
 * @param {string} req.body.catwayState - Nouvel état du catway
 * @returns {Object} Catway mis à jour
 * @returns {string} Message si non trouvé
 */
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

/**
 * Supprime un catway
 * @route DELETE /catways/:id
 * @param {Object} req.params - Paramètres de route
 * @param {string} req.params.id - Numéro du catway
 * @returns {string} Confirmation de suppression
 */
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
