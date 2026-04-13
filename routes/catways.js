var express = require("express");
var router = express.Router();
const service = require("../Services/catways");
const auth = require("../middlewares/private");

/**
 * Affiche la liste des catways (page HTML)
 * @route GET /page/all
 * @middleware auth.checkJWT - Vérifie l'authentification JWT
 * @returns {HTML} Page des catways
 */
router.get("/page/all", auth.checkJWT, async (req, res) => {
  try {
    const catways = await service.getAllCatways();
    res.render("catways/index", { catways, error: null, success: null });
  } catch (err) {
    res.redirect("/dashboard");
  }
});

/**
 * Affiche un catway selon son id
 * @route GET /page/catways/:id
 * @middleware auth.checkJWT - Vérifie l'authentification JWT
 * @param {string} req.params.id - Numéro du catway
 * @returns {HTML} Détail du catway
 */
router.get("/page/:id", auth.checkJWT, async (req, res) => {
  try {
    const catway = await service.getCatwayById(req.params.id);
    res.render("catways/detail", { catway });
  } catch (err) {
    res.redirect("/catways/page/all");
  }
});

/**
 * Ajoute un catway
 * @route ADD /page/catways
 * @middleware auth.checkJWT - Vérifie l'authentification JWT
 * @returns {HTML}
 */
router.post("/page/add", auth.checkJWT, async (req, res) => {
  try {
    await service.createCatway(req.body);
    res.redirect("/catways/page/all");
  } catch (err) {
    const catways = await service.getAllCatways();
    res.render("catways/index", { catways, error: err.message, success: null });
  }
});

/**
 * Modifie un catways
 * @route POST /page/edit/:id
 * @middleware auth.checkJWT - Vérifie l'authentification JWT
 * @param {string} req.params.id - Numéro du catway
 * @returns {HTML}
 */
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

/**
 * Supprime un catway
 * @routes DELETE /page/:id
 * @middleware auth.checkJWT - Vérifie l'authentification JWT
 * @param {string} req.params.id - Numéro du catway
 * @returns {HTML}
 *
 */
router.post("/page/delete/:id", auth.checkJWT, async (req, res) => {
  try {
    await service.deleteCatway(req.params.id);
    res.redirect("/catways/page/all");
  } catch (err) {
    res.redirect("/catways/page/all");
  }
});

module.exports = router;
