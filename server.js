const express = require("express");
const mongoose = require("mongoose");
const movieRoutes = require("./routes/movieRoutes"); 
const userRoutes = require("./routes/routes"); 
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 9992;

// Middleware
app.use(express.json());

// Routes
app.use("/movies", movieRoutes);
app.use("/api", userRoutes);


// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.error("MongoDB connection error:", error.message));
