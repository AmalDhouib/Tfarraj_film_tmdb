const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Fuse = require("fuse.js"); // For fuzzy matching
require("dotenv").config();

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Movie schema and model
const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  link: { type: String }, // Add a field for the relative movie link
  category: String,
  overview: String,
  poster_path: String,
  rating: Number,
  release_date: String,
  views: Number,
});
const Movie = mongoose.model("Movie", movieSchema);

// Folder containing movie files (relative to the application root)
const folderPath = "movies"; // Ensure this folder is in the app's directory

(async () => {
  try {
    // Step 1: List all .mp4 files in the folder
    const files = fs
      .readdirSync(folderPath)
      .filter((file) => path.extname(file).toLowerCase() === ".mp4");

    // Step 2: Fetch all movies from the database
    const movies = await Movie.find({}, { _id: 1, title: 1 });

    // Step 3: Set up fuzzy search
    const fuse = new Fuse(files, { keys: [], threshold: 0.4 });

    // Step 4: Match each movie title to a file
    for (const movie of movies) {
      const result = fuse.search(movie.title);
      if (result.length > 0) {
        const bestMatch = result[0].item; // Get the best match
        const relativeLink = path.join(folderPath, bestMatch); // Generate relative link

        // Update the database with the relative link
        await Movie.updateOne(
          { _id: movie._id },
          { $set: { link: relativeLink } }
        );
        console.log(`Updated movie: ${movie.title} with link: ${relativeLink}`);
      } else {
        console.log(`No match found for movie: ${movie.title}`);
      }
    }

    console.log("Database update complete.");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    mongoose.connection.close();
  }
})();
