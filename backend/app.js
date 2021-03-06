const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const saucesRoutes = require("./routes/sauces");
const userRoutes = require("./routes/user");
const path = require("path");
const helmet = require("helmet");
require("dotenv").config();
const mongoSanitize = require("express-mongo-sanitize");
const apiLimiter = require("./middleware/api-limiter");

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8cgev.mongodb.net/${process.env.DB_DATABASE}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(bodyParser.json()); // Transforme le corps de la requête en objet JS
app.use(helmet()); // Protège contre les fails XSS (bloc ce qui peut être du code)
app.use(mongoSanitize()); // Cherche dans les req et supprime toutes les clés commençant par $ ou contenant "."

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/sauces", apiLimiter, saucesRoutes);
app.use("/api/auth", apiLimiter, userRoutes);

module.exports = app;
