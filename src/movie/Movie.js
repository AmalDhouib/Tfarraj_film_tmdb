const mongoose = require("mongoose");


const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  overview: { type: String },
  release_date: { type: String },
  poster_path: { type: String },
  rating: { type: Number },
  views: { type: Number, default: 0 }, // Define views as a number
  category: { type: String }, // e.g., "popular", "top_rated", "now_playing"
  tmdb_id: { type: String, required: true, unique: true }, // TMDB ID added here
  link: { type: String, required: true }, // Assurez-vous que ce champ est défini
});

const Movie = mongoose.model("Movie", movieSchema); // Crée le modèle Movie
module.exports = Movie; // Exportez le modèle

