const express = require("express");
const mongoose = require("mongoose");
const { updatePosters } = require("./src/movie/movieController"); // Import updatePosters function

const app = express();
const PORT = process.env.PORT || 9992;

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/movie-db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Start the server
app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);

  try {
    console.log("Automatically updating movie posters...");
    await updatePosters();
    console.log("Movie posters updated automatically!");
  } catch (error) {
    console.error("Error updating movie posters:", error.message);
  }
});
