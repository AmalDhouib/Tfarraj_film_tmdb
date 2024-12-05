const mongoose = require("mongoose");
const axios = require("axios");
require("dotenv").config();

const Movie = require("./src/movie/Movie"); // Adjust the path to your model

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Function to update movies with tmdb_id
const updateMoviesWithTmdbId = async () => {
  try {
    // Fetch all movies from the database
    const movies = await Movie.find();

    for (const movie of movies) {
      // Use TMDB API to search for the movie by title
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie`,
        {
          params: {
            api_key: process.env.TMDB_API_KEY, // Your TMDB API key
            query: movie.title,
          },
        }
      );

      const results = response.data.results;

      // Match the movie based on title and release_date
      const tmdbMovie = results.find(
        (m) =>
          m.title === movie.title &&
          new Date(m.release_date).getFullYear() ===
            new Date(movie.release_date).getFullYear()
      );

      if (tmdbMovie) {
        // Update the movie document with tmdb_id
        movie.tmdb_id = tmdbMovie.id;
        await movie.save();
        console.log(
          `Updated movie: ${movie.title} with tmdb_id: ${tmdbMovie.id}`
        );
      } else {
        console.log(`TMDB ID not found for movie: ${movie.title}`);
      }
    }

    console.log("All movies updated successfully!");
    mongoose.disconnect();
  } catch (err) {
    console.error("Error updating movies:", err);
  }
};

updateMoviesWithTmdbId();
