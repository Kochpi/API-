const express = require("express");
const router = express.Router({ mergeParams: true }); // important pour récupérer :id du catway
const service = require("../Services/reservations");

// GET /catways/:id/reservations
router.get("/", async (req, res) => {
  try {
    const reservations = await service.getAll(req.params.id);
    res.status(200).json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /catways/:id/reservations/:idReservation
router.get("/:idReservation", async (req, res) => {
  try {
    const reservation = await service.getById(req.params.idReservation);
    if (!reservation)
      return res.status(404).json({ message: "Réservation non trouvée" });
    res.status(200).json(reservation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /catways/:id/reservations
router.post("/", async (req, res) => {
  try {
    const reservation = await service.create(req.params.id, req.body);
    res.status(201).json(reservation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /catways/:id/reservations/:idReservation
router.put("/:idReservation", async (req, res) => {
  try {
    const reservation = await service.update(
      req.params.idReservation,
      req.body,
    );
    if (!reservation)
      return res.status(404).json({ message: "Réservation non trouvée" });
    res.status(200).json(reservation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /catways/:id/reservations/:idReservation
router.delete("/:idReservation", async (req, res) => {
  try {
    const reservation = await service.remove(req.params.idReservation);
    if (!reservation)
      return res.status(404).json({ message: "Réservation non trouvée" });
    res.status(200).json({ message: "Réservation supprimée" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
