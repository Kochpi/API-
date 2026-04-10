var express = require("express");
var router = express.Router();
const service = require("../Services/users");
const userRoute = require("../routes/users");
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

router.get("/:id", private.checkJWT, service.getById);
router.post("/add", service.add);
router.patch("/:id", private.checkJWT, service.update);
router.delete("/:id", private.checkJWT, service.delete);
router.post("/authenticate", service.authenticate);

module.exports = router;
