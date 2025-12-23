const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = process.env.REACT_APP_TMDB_BASE_URL;
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export const tmdbService = {
  // Popular Movies
  getPopularMovies: async () => {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
    return response.json();
  },

  // Popular TV Shows
  getPopularTVShows: async () => {
    const response = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}`);
    return response.json();
  },

  // Trending (Movies + TV)
  getTrending: async (timeWindow = 'day') => {
    const response = await fetch(`${BASE_URL}/trending/all/${timeWindow}?api_key=${API_KEY}`);
    return response.json();
  },

  // Search
  search: async (query) => {
    const response = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
    return response.json();
  },

  // Movie Details
  getMovieDetails: async (id) => {
    const response = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=videos,credits`);
    return response.json();
  },

  // TV Show Details
  getTVDetails: async (id) => {
    const response = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}&append_to_response=videos,credits`);
    return response.json();
  },

  // Get Image URL
  getImageUrl: (path, size = 'w500') => {
    return path ? `https://image.tmdb.org/t/p/${size}${path}` : null;
  }
};