var express = require("express");
const favicon = require("serve-favicon");
var path = require("path");
var logger = require("morgan");
const cookieSession = require("cookie-session");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./docs/swagger.yaml");

// Imports des routes
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const catwayRouter = require("./routes/catways");
const reservationsRouter = require("./routes/reservations");

var app = express();

console.log("APP.JS CHARGÉ ✅");

// Middlewares
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "session",
    secret: process.env.SECRET_KEY,
    maxAge: 24 * 60 * 60 * 1000,
  }),
);
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

// Config EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get("/", (req, res) => res.render("index"));
app.use("/", usersRouter);
app.use("/users", usersRouter);
app.use("/catways", catwayRouter);
app.use("/reservations", reservationsRouter);

module.exports = app;
