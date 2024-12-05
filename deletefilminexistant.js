const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Arrêter si la connexion échoue
  });

// Modèle Mongoose pour les films
const movieSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Titre du film
  category: String,
  overview: String,
  poster_path: String,
  rating: Number,
  release_date: String,
  views: Number,
});
const Movie = mongoose.model("Movie", movieSchema);

// Chemin du dossier contenant les vidéos
const folderPath = "C:/Users/21697/OneDrive/Bureau/node/movies";

(async () => {
  try {
    // Étape 1 : Lister les fichiers MP4 dans le dossier "movies"
    const filesInFolder = new Set(
      fs
        .readdirSync(folderPath)
        .filter((file) => path.extname(file).toLowerCase() === ".mp4") // Garder uniquement les fichiers .mp4
        .map((file) => path.basename(file, ".mp4").toLowerCase()) // Supprimer l'extension pour comparer avec les titres
    );

    // Étape 2 : Récupérer les films de la base de données
    const moviesInDb = await Movie.find({}, { _id: 1, title: 1 });

    // Étape 3 : Identifier les films à supprimer
    const toDelete = moviesInDb
      .filter((movie) => !filesInFolder.has(movie.title.toLowerCase())) // Vérifier si le titre est présent dans les fichiers
      .map((movie) => movie._id);

    if (toDelete.length > 0) {
      // Étape 4 : Supprimer les films qui n'ont pas de vidéo correspondante
      const result = await Movie.deleteMany({ _id: { $in: toDelete } });
      console.log(
        `${result.deletedCount} films supprimés de la base de données.`
      );
    } else {
      console.log(
        "Tous les films de la base de données ont une vidéo correspondante dans le dossier."
      );
    }
  } catch (err) {
    console.error("Erreur :", err);
  } finally {
    mongoose.connection.close(); 
  }
})();
