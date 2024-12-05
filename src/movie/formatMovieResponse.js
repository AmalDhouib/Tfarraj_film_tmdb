const formatMovieResponse = (tmdbData, movie) => {
  return {
    id: movie._id,
    tmdb_id: movie.tmdb_id,
    title: tmdbData?.title || movie.title,
    original_title:
      tmdbData?.original_title || movie.original_title || movie.title,
    overview: tmdbData?.overview || movie.overview || "",
    release_date: tmdbData?.release_date || movie.release_date,
    genres: tmdbData?.genres || movie.genres || [],
    poster_path: tmdbData?.poster_path || movie.poster_path || null,
    backdrop_path: tmdbData?.backdrop_path || movie.backdrop_path || null,
    popularity: tmdbData?.popularity || movie.popularity || 0,
    vote_average: tmdbData?.vote_average || movie.vote_average || 0,
    vote_count: tmdbData?.vote_count || movie.vote_count || 0,
    original_language:
      tmdbData?.original_language || movie.original_language || "en",
    production_companies:
      tmdbData?.production_companies || movie.production_companies || [],
    budget: movie.budget || 0,
    revenue: movie.revenue || 0,
    runtime: tmdbData?.runtime || movie.runtime || 0,
    homepage: movie.homepage || "",
    imdb_id: movie.imdb_id || null,
    origin_country: movie.origin_country || ["US"],
    spoken_languages: movie.spoken_languages || [],
    status: movie.status || "Unknown",
    tagline: movie.tagline || "",
    local_link: movie.link.replace(/\\/g, "/"), 
  };
};

module.exports = formatMovieResponse;
