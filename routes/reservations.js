const express = require("express");
const router = express.Router();
const service = require("../Services/reservations");
const private = require("../middlewares/private");

// Liste toutes les réservations
router.get("/all", private.checkJWT, async (req, res) => {
  try {
    const reservations = await service.getAllReservations();
    res.render("reservations/index", { reservations, error: null });
  } catch (err) {
    res.redirect("/dashboard");
  }
});

// Détail d'une réservation
router.get("/:id", private.checkJWT, async (req, res) => {
  try {
    const reservation = await service.getById(req.params.id);
    res.render("reservations/detail", { reservation });
  } catch (err) {
    res.redirect("/reservations/all");
  }
});

router.post("/add", private.checkJWT, async (req, res) => {
  try {
    await service.create(req.body.catwayNumber, req.body); // 👈
    res.redirect("/reservations/all");
  } catch (err) {
    const reservations = await service.getAllReservations();
    res.render("reservations/index", { reservations, error: err.message });
  }
});

// Modifier une réservation
router.post("/edit/:id", private.checkJWT, async (req, res) => {
  try {
    await service.update(req.params.id, req.body);
    res.redirect("/reservations/all");
  } catch (err) {
    res.redirect("/reservations/all");
  }
});

// Supprimer une réservation
router.post("/delete/:id", private.checkJWT, async (req, res) => {
  try {
    await service.remove(req.params.id);
    res.redirect("/reservations/all");
  } catch (err) {
    res.redirect("/reservations/all");
  }
});

module.exports = router;
