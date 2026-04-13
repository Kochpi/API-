const Reservation = require("../models/reservation");
const Catway = require("../models/catway");

/**
 * Récupère toutes les réservations
 * @route GET /reservations
 * @returns {object[]} Liste des réservations
 */
exports.getAllReservations = async () => {
  return await Reservation.find();
};

/**
 * Récupère toutes les réservations pour un catway donné
 * @param {number} catwayNumber - Numéro du catway
 * @returns {Promise<Object[]>} Liste des réservations
 */
exports.getAll = async (catwayNumber) => {
  return await Reservation.find({ catwayNumber });
};

/**
 * Récupère une réservation par son ID
 * @param {string} id - ID de la réservation
 * @returns {Promise<Object|null>} Réservation trouvée ou null
 */
exports.getById = async (id) => {
  return await Reservation.findById(id);
};

/**
 * Crée une nouvelle réservation
 * @param {number} catwayNumber - Numéro du catway
 * @param {Object} data - Données de la réservation
 * @param {string} data.clientName - Nom du client
 * @param {string} data.boatName - Nom du bateau
 * @param {Date} data.startDate - Date de début
 * @param {Date} data.endDate - Date de fin
 * @returns {Promise<Object>} Réservation créée
 */
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

/**
 * Met à jour une réservation
 * @param {string} id - ID de la réservation
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise<Object|null>} Réservation mise à jour ou null
 */
exports.update = async (id, data) => {
  return await Reservation.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true },
  );
};

/**
 * Supprime une réservation
 * @param {string} id - ID de la réservation
 * @returns {Promise<Object|null>} Réservation supprimée ou null
 */
exports.remove = async (id) => {
  return await Reservation.findByIdAndDelete(id);
};
