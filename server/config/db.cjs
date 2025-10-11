const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { ServerApiVersion } = require("mongodb");

dotenv.config({
  path: `.env${process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''}`
});

console.log("MongoDB URI : ", process.env.MONGO_URI);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverApi: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    });
    console.log("✅ Connecté à MongoDB avec succès");
  } catch (error) {
    console.error("❌ Erreur de connexion à MongoDB :", error);
    process.exit(1);
  }
};

module.exports = connectDB;
