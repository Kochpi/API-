const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;
const Reservation = require("../models/reservation");

// Fonctions pour les pages EJS (par email)

/**
 * Récupère tous les utilisateurs (sans mot de passe)
 * @returns {Promise<Object[]>} Liste des utilisateurs
 */
exports.getAllUsers = async () => {
  return await User.find({}, "-password"); // on cache le mot de passe
};

/**
 * Récupère un utilisateur par email (sans mot de passe)
 * @param {string} email - Email de l'utilisateur
 * @returns {Promise<Object|null>} Utilisateur trouvé ou null
 */
exports.getByEmail = async (email) => {
  return await User.findOne({ email }, "-password");
};

/**
 * Crée un nouvel utilisateur
 * @param {UserData} data - Données de l'utilisateur
 * @returns {Promise<Object>} Utilisateur créé
 */
exports.createUser = async (data) => {
  const user = new User(data);
  return await user.save();
};

/**
 * Met à jour un utilisateur via son email
 * @param {string} email - Email de l'utilisateur
 * @param {Partial<UserData>} data - Données à mettre à jour
 * @throws {Error} Si l'utilisateur n'existe pas
 * @returns {Promise<Object>} Utilisateur mis à jour
 */
exports.updateByEmail = async (email, data) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Utilisateur non trouvé");

  Object.keys(data).forEach((key) => {
    if (!!data[key]) user[key] = data[key];
  });

  return await user.save();
};

/**
 * Supprime un utilisateur via son email
 * @param {string} email - Email de l'utilisateur
 * @returns {Promise<Object>} Résultat de la suppression
 */
exports.deleteByEmail = async (email) => {
  return await User.deleteOne({ email });
};

/**
 * Récupère un utilisateur par son ID
 * @route GET /users/:id
 * @param {Object} req.params - Paramètres de route
 * @param {string} req.params.id - ID de l'utilisateur
 * @returns {Object} Utilisateur trouvé
 * @returns {string} Message si non trouvé
 */
exports.getById = async (req, res, next) => {
  const id = req.params.id;

  try {
    let user = await User.findById(id);

    if (user) {
      return res.status(200).json(user);
    }

    return res.status(404).json("user_not_found");
  } catch (error) {
    return res.status(501).json(error);
  }
};

/**
 * Crée un nouvel utilisateur
 * @route POST /users
 * @param {Object} req.body - Données de l'utilisateur
 * @param {string} req.body.username - Nom d'utilisateur
 * @param {string} req.body.email - Email
 * @param {string} req.body.password - Mot de passe
 * @returns {Object} Utilisateur créé
 */
exports.add = async (req, res, next) => {
  console.log("body reçu :", req.body);
  const temp = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  };

  try {
    let user = await User.create(temp);

    return res.status(201).json(user);
  } catch (error) {
    console.log("erreur :", error);
    return res.status(501).json(error);
  }
};

/**
 * Met à jour un utilisateur
 * @route PUT /users/:id
 * @param {Object} req.params - Paramètres de route
 * @param {string} req.params.id - ID de l'utilisateur
 * @param {Object} req.body - Données à mettre à jour
 * @param {string} [req.body.username] - Nom d'utilisateur
 * @param {string} [req.body.email] - Email
 * @param {string} [req.body.password] - Mot de passe
 * @returns {Object} Utilisateur mis à jour
 * @returns {string} Message si non trouvé
 */
exports.update = async (req, res, next) => {
  const id = req.params.id;
  const temp = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  };

  try {
    let user = await User.findOne({ _id: id });

    if (user) {
      Object.keys(temp).forEach((key) => {
        if (!!temp[key]) {
          user[key] = temp[key];
        }
      });

      await user.save();
      return res.status(201).json(user);
    }

    return res.status(404).json("user_not_found");
  } catch (error) {
    return res.status(501).json(error);
  }
};

/**
 * Supprimer un utilisateur
 * @route DELETE /users/:id
 * @param {Object} req.params Paramètre de route
 * @param {String} req.params.id ID de l'utilisateur
 * @returns {Object} Utilisateur supprimé
 * @returns {String} Error 501 si non trouvé
 */
exports.delete = async (req, res, next) => {
  const id = req.params.id;

  try {
    await User.deleteOne({ _id: id });

    return res.status(204).json("delete_ok");
  } catch (error) {
    return res.status(501).json(error);
  }
};

exports.authenticate = async (req, res, next) => {
  const { email, password } = req.body;
  const SECRET_KEY = process.env.SECRET_KEY;

  try {
    let user = await User.findOne(
      { email: email },
      "-__v -createdAt -updatedAt",
    );

    if (user) {
      bcrypt.compare(password, user.password, function (err, response) {
        if (err) {
          throw new Error(err);
        }
        if (response) {
          delete user._doc.password;

          const expireIn = 24 * 60 * 60;
          const token = jwt.sign(
            {
              user: user,
            },
            SECRET_KEY,
            {
              expiresIn: expireIn,
            },
          );

          res.header("Authorization", "Bearer " + token);

          return res.status(200).json("authenticate_succeed");
        }

        return res.status(403).json("wrong_credentials");
      });
    } else {
      return res.status(404).json("user_not_found");
    }
  } catch (error) {
    return res.status(501).json(error);
  }
};

exports.login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Utilisateur non trouvé");

  const isValid = await user.comparePassword(password);
  if (!isValid) throw new Error("Mot de passe incorrect");

  const token = jwt.sign(
    { user: { id: user._id, email: user.email, username: user.username } },
    SECRET_KEY,
    { expiresIn: "24h" },
  );

  return { token, user };
};

exports.getReservationsEnCours = async () => {
  const today = new Date();
  return await Reservation.find({
    startDate: { $lte: today },
    endDate: { $gte: today },
  });
};
