// routes/movieroute1.js
const express = require("express");
const router = express.Router();
const Movie = require("../src/movie/Movie"); // Import your Movie model

// Route to get movie by TMDB ID
router.get("/idmovie/:tmdbId", async (req, res) => {
  let { tmdbId } = req.params;

  // Trim the incoming TMDB ID to avoid unexpected issues
  tmdbId = tmdbId.trim();

  try {
    // Search for the movie by TMDB ID in the database
    const movie = await Movie.findOne({ tmdb_id: tmdbId });

    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    // Check and clean the 'link' field if it exists
    if (movie.link) {
      movie.link = movie.link.replace(/\\/g, "/"); // Normalize link paths
    } else {
      movie.link = "Link not available"; // Default value
    }

    res.status(200).json(movie); // Return the movie data
  } catch (error) {
    console.error("Error fetching movie:", error);
    res.status(500).json({ error: "Failed to fetch movie information" });
  }
});

module.exports = router;
