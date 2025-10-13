import mongoose from "mongoose";
import dotenv from "dotenv";
import { ServerApiVersion } from "mongodb";
import path from "path";
import { fileURLToPath } from "url";

// Pour avoir __dirname en ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Résoudre le chemin du fichier .env en fonction de l'environnement
const envFilePath = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';

// Charger les variables d'environnement à partir du fichier
const result = dotenv.config({
    path: path.resolve(__dirname, envFilePath)
});

if (result.error) {
    console.error('Erreur lors du chargement du fichier .env :', result.error);
    process.exit(1); // Quittez l'application en cas d'erreur de chargement du fichier .env
}

console.log("MongoDB URI : ", process.env.MONGO_URI);

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    await mongoose.connect(uri, {
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
