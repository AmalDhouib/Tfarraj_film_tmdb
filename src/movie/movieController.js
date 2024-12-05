const Movie = require("./Movie"); // Import Movie model
const { fetchMovies } = require("./tmdbService"); // Import TMDB service

const cron = require("node-cron");

// Fetch poster URL from TMDB
const fetchPosterURL = async (title) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/movie`,
      {
        params: {
          api_key: process.env.TMDB_API_KEY, // TMDB API key from your .env
          query: title,
        },
      }
    );

    const results = response.data.results;
    if (results && results.length > 0) {
      return `https://image.tmdb.org/t/p/w500${results[0].poster_path}`;
    }
    return null; // No poster found
  } catch (error) {
    console.error(`Error fetching poster for "${title}":`, error.message);
    return null;
  }
};

// Function to update posters automatically
const updatePosters = async () => {
  try {
    // Fetch all movies from your database
    const movies = await Movie.find({});

    for (const movie of movies) {
      // Check if the movie already has a valid poster URL
      if (!movie.poster_path || !movie.poster_path.startsWith("http")) {
        const posterURL = await fetchPosterURL(movie.title); // Fetch poster URL
        if (posterURL) {
          movie.poster_path = posterURL; // Update the poster path
          await movie.save(); // Save the updated movie document
          console.log(`Updated poster for "${movie.title}"`);
        } else {
          console.log(`No poster found for "${movie.title}"`);
        }
      }
    }
  } catch (error) {
    console.error("Error updating movie posters:", error.message);
  }
};

// Schedule the updatePosters function to run every day at midnight
cron.schedule("0 0 * * *", async () => {
  console.log("Running scheduled task to update posters...");
  await updatePosters();
  console.log("Posters updated!");
});

// Sync movies from TMDB and save them to the database
const syncMovies = async (req, res) => {
  try {
    console.log("Starting movie sync...");

    // TMDB Endpoints with categories
    const endpointsWithCategories = [
      { endpoint: "/movie/top_rated", category: "top_rated" },
      { endpoint: "/movie/popular", category: "popular" },
      { endpoint: "/movie/now_playing", category: "now_playing" },
    ];

    // Number of pages to fetch per category
    const totalPages = 5; // Adjust this to fetch more pages

    for (const { endpoint, category } of endpointsWithCategories) {
      console.log(
        `Fetching movies for category: ${category} from endpoint: ${endpoint}`
      );

      for (let page = 1; page <= totalPages; page++) {
        console.log(`Fetching page ${page} for category: ${category}`);

        // Fetch movies for the current page
        const movies = await fetchMovies(endpoint, { page });
        console.log(
          `Fetched ${movies.length} movies from page ${page} for category: ${category}`
        );

        for (const movie of movies) {
          // Save or update movie data
          await Movie.updateOne(
            { title: movie.title }, // Match existing movie by title
            {
              title: movie.title || "Untitled Movie",
              overview: movie.overview || "No overview available.",
              release_date: movie.release_date || "Unknown",
              poster_path: movie.poster_path || "",
              rating: movie.vote_average || 0,
              views: movie.popularity || 0, // Use TMDB's popularity score for views
              category, // Assign the category
            },
            { upsert: true } // Insert if not found
          );

          console.log(`Saved or updated movie: ${movie.title}`);
        }
      }
    }

    res.status(200).json({ message: "All movies synced successfully!" });
  } catch (error) {
    console.error("Error syncing movies:", error);
    res.status(500).json({ error: "Failed to sync movies" });
  }
};

const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find(); // Fetch all movies
    res.status(200).json(movies); // Return movies as JSON
  } catch (error) {
    console.error("Error fetching movies:", error);
    res.status(500).json({ error: "Failed to fetch movies" });
  }
};

const getMoviesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    console.log(`Fetching movies for category: ${category}`);

    // Define sorting criteria based on category
    let sortCriteria = {};
    if (category === "popular")
      sortCriteria = { views: -1 }; // Descending by views
    else if (category === "top_rated")
      sortCriteria = { rating: -1 }; // Descending by rating
    else if (category === "now_playing") sortCriteria = { views: -1 }; // Descending by views

    const movies = await Movie.find({ category }).sort(sortCriteria);

    if (movies.length === 0) {
      return res
        .status(404)
        .json({ message: "No movies found for this category." });
    }

    res.status(200).json(movies);
  } catch (error) {
    console.error("Error fetching movies by category:", error);
    res.status(500).json({ error: "Failed to fetch movies" });
  }
};

module.exports = {
  syncMovies,
  getAllMovies,
  getMoviesByCategory,
  updatePosters,
};
