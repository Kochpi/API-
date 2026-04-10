const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);

    await mongoose.connect(process.env.URL_MONGO);

    console.log("Mongo connecté ✅");
  } catch (error) {
    console.error("Erreur MongoDB :", error);
    process.exit(1);
  }
};

module.exports = connectDB;
