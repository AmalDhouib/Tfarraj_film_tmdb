const axios = require("axios");

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

console.log("Loaded TMDB API Key:", TMDB_API_KEY); // Add this log

const fetchMovies = async (endpoint, params = {}) => {
  try {
    console.log(`Fetching data from TMDB API: ${endpoint}`);
    const response = await axios.get(`${TMDB_BASE_URL}${endpoint}`, {
      params: {
        api_key: TMDB_API_KEY,
        ...params,
      },
    });
    return response.data.results || [];
  } catch (error) {
    console.error(
      "Error fetching data from TMDB:",
      error.response?.data || error.message
    );
    return [];
  }
};

module.exports = { fetchMovies };
