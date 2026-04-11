const Reservation = require("../models/reservation");
const Catway = require("../models/catway");

exports.getAllReservations = async () => {
  return await Reservation.find();
};

// Lister toutes les réservations d'un catway
exports.getAll = async (catwayNumber) => {
  return await Reservation.find({ catwayNumber });
};

// Récupérer une réservation par son id
exports.getById = async (id) => {
  return await Reservation.findById(id);
};

// Créer une réservation
exports.create = async (catwayNumber, data) => {
  const reservation = new Reservation({
    catwayNumber,
    clientName: data.clientName,
    boatName: data.boatName,
    startDate: data.startDate,
    endDate: data.endDate,
  });
  return await reservation.save();
};

// Modifier une réservation
exports.update = async (id, data) => {
  return await Reservation.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true },
  );
};

// Supprimer une réservation
exports.remove = async (id) => {
  return await Reservation.findByIdAndDelete(id);
};
