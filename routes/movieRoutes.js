const express = require("express");
const axios = require("axios");
const router = express.Router();

// Import necessary functions and models
const {
  syncMovies,
  getMoviesByCategory,
  getAllMovies,
  updatePosters,
} = require("../src/movie/movieController");

const formatMovieResponse = require("../src/movie/formatMovieResponse");
console.log(formatMovieResponse);  // This should log the function definition

const Movie = require("../src/movie/Movie");
require("dotenv").config(); // Load environment variables

// Route to sync movies with TMDB data
router.get("/sync", syncMovies);

// Route to fetch movies by category from TMDB
router.get("/:category", async (req, res) => {
  const { category } = req.params;

  try {
    // Fetch movies from TMDB API
    const tmdbResponse = await axios.get(
      `https://api.themoviedb.org/3/movie/${category}`,
      {
        params: {
          api_key: process.env.TMDB_API_KEY,
          language: "fr-FR",
        },
      }
    );

    const tmdbMovies = tmdbResponse.data?.results || [];
    const moviesInDB = await Movie.find();
    const dbMovieMap = new Map(
      moviesInDB.map((movie) => [String(movie.tmdb_id), movie])
    );

    // Format movies using `formatMovieResponse`
    const formattedMovies = tmdbMovies
      .map((tmdbMovie) => {
        const movieFromDB = dbMovieMap.get(String(tmdbMovie.id));
        if (!movieFromDB) return null; // Skip if not in DB
        return formatMovieResponse(tmdbMovie, movieFromDB);
      })
      .filter((movie) => movie !== null); // Remove nulls

    res.json(formattedMovies);
  } catch (error) {
    console.error("Error in /movies/:category:", error.message);
    res.status(500).json({ message: "Erreur serveur." });
  }
});


// Route to update movie posters
router.get("/update-posters", updatePosters);

// Endpoint to get a single movie by TMDB ID
router.get("/idmovie/:tmdb_id", async (req, res) => {
  const { tmdb_id } = req.params;

  try {
    const movie = await Movie.findOne({ tmdb_id });
    if (!movie) {
      return res
        .status(404)
        .json({ message: "Film non trouvé dans la base de données." });
    }

    // Fetch detailed movie data from TMDB API
    const tmdbResponse = await axios.get(
      `https://api.themoviedb.org/3/movie/${tmdb_id}`,
      {
        params: {
          api_key: process.env.TMDB_API_KEY,
          language: "fr-FR",
        },
      }
    );

    const tmdbData = tmdbResponse.data;
    const response = formatMovieResponse(tmdbData, movie);

    res.json(response);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Erreur serveur." });
  }
});
router.get("/", async (req, res) => {
  try {
    const moviesInDB = await Movie.find();

    const formattedMovies = moviesInDB
      .filter((movie) => movie.link) // Only include movies with a valid link
      .map((movie) => formatMovieResponse(null, movie)); // Pass `null` for `tmdbData`

    res.json(formattedMovies);
  } catch (error) {
    console.error("Error fetching all movies:", error.message);
    res.status(500).json({ message: "Erreur serveur." });
  }
});


module.exports = router;
