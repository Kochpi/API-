const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

exports.checkJWT = async (req, res, next) => {
  // Cherche le token dans les headers OU dans la session
  let token =
    req.headers["x-access-token"] ||
    req.headers["authorization"] ||
    req.session.token; // 👈 ajout

  if (!!token && token.startsWith("Bearer ")) {
    token = token.slice(7, token.length); // 👈 correction : "length" pas "lenght"
  }

  if (token) {
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.redirect("/"); // 👈 redirige vers l'accueil au lieu de JSON
      } else {
        req.decoded = decoded;

        const expiresIn = 24 * 60 * 60;
        const newToken = jwt.sign({ user: decoded.user }, SECRET_KEY, {
          expiresIn: expiresIn,
        });

        req.session.token = newToken; // 👈 renouvelle le token en session
        res.header("Authorization", "Bearer " + newToken);
        next();
      }
    });
  } else {
    return res.redirect("/"); // 👈 redirige vers l'accueil au lieu de JSON
  }
};
