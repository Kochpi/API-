var express = require("express");
var router = express.Router();
const service = require("../Services/catways");
const auth = require("../middlewares/private");

/**
 * @module Catways
 * @description Gestion des catways du port de plaisance
 */

/**
 * Liste tous les catways
 * @name GET /catways
 * @function
 * @memberof module:Catways
 */
router.get("/", auth.checkJWT, service.getAll);

/**
 * Récupère un catway par son id
 * @name GET /catways/:id
 * @function
 * @memberof module:Catways
 * @param {string} id - L'identifiant du catway
 */
router.get("/:id", auth.checkJWT, service.getById);

/**
 * Crée un nouveau catway
 * @name POST /catways
 * @function
 * @memberof module:Catways
 * @param {number} catwayNumber - Le numéro du catway
 * @param {string} catwayType - Le type (long/short)
 * @param {string} catwayState - L'état du catway
 */
router.post("/", auth.checkJWT, service.add);

/**
 * Modifie l'état d'un catway
 * @name PUT /catways/:id
 * @function
 * @memberof module:Catways
 * @param {string} id - L'identifiant du catway
 * @param {string} catwayState - Le nouvel état
 */
router.put("/:id", auth.checkJWT, service.update);

/**
 * Supprime un catway
 * @name DELETE /catways/:id
 * @function
 * @memberof module:Catways
 * @param {string} id - L'identifiant du catway
 */
router.delete("/:id", auth.checkJWT, service.delete);

// Page principale catways
router.get("/page/all", auth.checkJWT, async (req, res) => {
  try {
    const catways = await service.getAllCatways();
    res.render("catways/index", { catways, error: null, success: null });
  } catch (err) {
    res.redirect("/dashboard");
  }
});

// Détail d'un catway
router.get("/page/:id", auth.checkJWT, async (req, res) => {
  try {
    const catway = await service.getCatwayById(req.params.id);
    res.render("catways/detail", { catway });
  } catch (err) {
    res.redirect("/catways/page/all");
  }
});

// Créer un catway
router.post("/page/add", auth.checkJWT, async (req, res) => {
  try {
    await service.createCatway(req.body);
    res.redirect("/catways/page/all");
  } catch (err) {
    const catways = await service.getAllCatways();
    res.render("catways/index", { catways, error: err.message, success: null });
  }
});

// Modifier un catway (seulement catwayState)
router.post("/page/edit/:id", auth.checkJWT, async (req, res) => {
  try {
    await service.updateCatway(req.params.id, {
      catwayState: req.body.catwayState,
    });
    res.redirect("/catways/page/all");
  } catch (err) {
    res.redirect("/catways/page/all");
  }
});

// Supprimer un catway
router.post("/page/delete/:id", auth.checkJWT, async (req, res) => {
  try {
    await service.deleteCatway(req.params.id);
    res.redirect("/catways/page/all");
  } catch (err) {
    res.redirect("/catways/page/all");
  }
});

module.exports = router;
