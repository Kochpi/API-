var express = require("express");
var router = express.Router();
const service = require("../Services/catways");
const private = require("../middlewares/private");

router.get("/", private.checkJWT, service.getAll);
router.get("/:id", private.checkJWT, service.getById);
router.post("/", private.checkJWT, service.add);
router.put("/:id", private.checkJWT, service.update);
router.delete("/:id", private.checkJWT, service.delete);

// Page principale catways
router.get("/page/all", private.checkJWT, async (req, res) => {
  try {
    const catways = await service.getAllCatways();
    res.render("catways/index", { catways, error: null, success: null });
  } catch (err) {
    res.redirect("/dashboard");
  }
});

// Détail d'un catway
router.get("/page/:id", private.checkJWT, async (req, res) => {
  try {
    const catway = await service.getCatwayById(req.params.id);
    res.render("catways/detail", { catway });
  } catch (err) {
    res.redirect("/catways/page/all");
  }
});

// Créer un catway
router.post("/page/add", private.checkJWT, async (req, res) => {
  try {
    await service.createCatway(req.body);
    res.redirect("/catways/page/all");
  } catch (err) {
    const catways = await service.getAllCatways();
    res.render("catways/index", { catways, error: err.message, success: null });
  }
});

// Modifier un catway (seulement catwayState)
router.post("/page/edit/:id", private.checkJWT, async (req, res) => {
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
router.post("/page/delete/:id", private.checkJWT, async (req, res) => {
  try {
    await service.deleteCatway(req.params.id);
    res.redirect("/catways/page/all");
  } catch (err) {
    res.redirect("/catways/page/all");
  }
});

module.exports = router;
