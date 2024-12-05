// server.js
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables

const movieRoutes = require("./routes/movieroute1"); // Import your movie routes
const app = express(); // Initialize Express

app.use(express.json()); // Middleware to parse JSON

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit the process if MongoDB fails to connect
  });

// Define the routes
app.use("/movies", movieRoutes); // Mount movie routes under "/movies"

// Start the server
const PORT = process.env.PORT || 9992;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
