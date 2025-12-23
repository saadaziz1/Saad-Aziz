import api from './api';

export const tmdbMovieService = {
  // Add TMDb movie to website
  addMovie: async (movieData) => {
    const response = await api.post('/tmdb/add', movieData);
    return response.data;
  },

  // Get active movies for public
  getActiveMovies: async () => {
    const response = await api.get('/tmdb/active');
    return response.data;
  },

  // Get all movies for admin
  getAllMovies: async () => {
    const response = await api.get('/tmdb/all');
    return response.data;
  },

  // Remove movie
  removeMovie: async (id) => {
    const response = await api.delete(`/tmdb/${id}`);
    return response.data;
  },

  // Toggle movie status
  toggleStatus: async (id) => {
    const response = await api.patch(`/tmdb/${id}/toggle`);
    return response.data;
  }
};