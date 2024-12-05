require("dotenv").config(); // Load environment variables
const mongoose = require("mongoose");
const xlsx = require("xlsx");
const Movie = require("./src/movie/Movie"); // Your Movie model

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1); // Exit if MongoDB connection fails
  });

const exportMoviesToExcel = async () => {
  try {
    console.log("Fetching movies from the database...");

    // Fetch all movies from the database
    const movies = await Movie.find({}, "title"); // Fetch only the 'title' field

    if (movies.length === 0) {
      console.log("No movies found in the database.");
      return;
    }

    console.log(`Fetched ${movies.length} movies.`);

    // Create an array of movie titles
    const movieTitles = movies.map((movie) => ({ Title: movie.title }));

    // Create a new workbook
    const workbook = xlsx.utils.book_new();

    // Convert movie titles to a worksheet
    const worksheet = xlsx.utils.json_to_sheet(movieTitles);

    // Append the worksheet to the workbook
    xlsx.utils.book_append_sheet(workbook, worksheet, "Movies");

    // Write the workbook to a file
    const fileName = "movies.xlsx";
    xlsx.writeFile(workbook, fileName);

    console.log(`Movie titles exported to ${fileName}`);
  } catch (error) {
    console.error("Error exporting movies:", error);
  } finally {
    mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

// Run the export function
exportMoviesToExcel();
