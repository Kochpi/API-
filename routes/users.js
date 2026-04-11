var express = require("express");
var router = express.Router();
const service = require("../Services/users");
const private = require("../middlewares/private");

// POST /login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await service.login(email, password);

    // On stocke le token en session
    req.session.token = token;
    req.session.user = { email: user.email, username: user.username };

    res.redirect("/dashboard");
  } catch (err) {
    // En cas d'erreur, on renvoie sur l'accueil avec un message
    res.render("index", { error: err.message });
  }
});

// GET /logout
router.get("/logout", (req, res) => {
  req.session = null; // détruit la session
  res.redirect("/");
});

router.get("/dashboard", private.checkJWT, async (req, res) => {
  try {
    const reservations = await service.getReservationsEnCours();
    res.render("dashboard", {
      user: req.session.user,
      reservations: reservations,
      date: new Date().toLocaleDateString("fr-FR"),
    });
  } catch (err) {
    res.redirect("/");
  }
});

// ---- Routes EJS users ----

// Liste tous les utilisateurs
router.get("/all", private.checkJWT, async (req, res) => {
  try {
    const users = await service.getAllUsers();
    res.render("users/index", { users, error: null });
  } catch (err) {
    res.redirect("/dashboard");
  }
});

// Détail d'un utilisateur par email
router.get("/detail/:email", private.checkJWT, async (req, res) => {
  try {
    const user = await service.getByEmail(req.params.email);
    if (!user) return res.redirect("/users/all");
    res.render("users/detail", { user, error: null });
  } catch (err) {
    res.redirect("/users/all");
  }
});

// Créer un utilisateur
router.post("/page/add", private.checkJWT, async (req, res) => {
  try {
    await service.createUser(req.body);
    res.redirect("/users/all");
  } catch (err) {
    const users = await service.getAllUsers();
    res.render("users/index", { users, error: err.message });
  }
});

// Modifier un utilisateur
router.post("/page/edit/:email", private.checkJWT, async (req, res) => {
  try {
    await service.updateByEmail(req.params.email, req.body);
    res.redirect("/users/all");
  } catch (err) {
    res.redirect("/users/all");
  }
});

// Supprimer un utilisateur
router.post("/page/delete/:email", private.checkJWT, async (req, res) => {
  try {
    await service.deleteByEmail(req.params.email);
    res.redirect("/users/all");
  } catch (err) {
    res.redirect("/users/all");
  }
});

router.get("/:id", private.checkJWT, service.getById);
router.post("/add", service.add);
router.patch("/:id", private.checkJWT, service.update);
router.delete("/:id", private.checkJWT, service.delete);
router.post("/authenticate", service.authenticate);

module.exports = router;
