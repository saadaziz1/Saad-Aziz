import React, { useState, useEffect } from 'react';
import { tmdbService } from '../../services/tmdb';
import { tmdbMovieService } from '../../services/tmdbMovieService';
import AdminLayout from './AdminLayout';
import SuperAdminLayout from '../SuperAdmin/SuperAdminLayout';
import { useAuth } from '../../context/AuthContext';

const ManageTMDBMovies = () => {
  const { isSuperAdmin } = useAuth();
  const [tmdbMovies, setTmdbMovies] = useState([]);
  const [addedMovies, setAddedMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAddedMovies();
  }, []);

  const fetchAddedMovies = async () => {
    try {
      const response = await tmdbMovieService.getAllMovies();
      setAddedMovies(response.data);
    } catch (error) {
      console.error('Error fetching added movies:', error);
    }
  };

  const searchMovies = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const response = await tmdbService.search(searchQuery);
      setTmdbMovies(response.results || []);
    } catch (error) {
      console.error('Error searching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const addMovieToWebsite = async (movie) => {
    try {
      const movieData = {
        tmdbId: movie.id.toString(),
        title: movie.title || movie.name,
        overview: movie.overview,
        posterPath: movie.poster_path,
        backdropPath: movie.backdrop_path,
        releaseDate: movie.release_date || movie.first_air_date,
        voteAverage: movie.vote_average,
        genres: movie.genre_ids || [],
        mediaType: movie.media_type || (movie.title ? 'movie' : 'tv')
      };

      await tmdbMovieService.addMovie(movieData);
      alert('Movie added to website successfully!');
      fetchAddedMovies();
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding movie');
    }
  };

  const LayoutComponent = isSuperAdmin ? SuperAdminLayout : AdminLayout;

  return (
    <LayoutComponent>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">TMDb Movies Management</h1>
        <p className="text-gray-400">Search and manage movies from The Movie Database</p>
      </div>

      {/* Search Section */}
      <div className="bg-gray-900 rounded-lg p-6 mb-8 border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4">Search & Add Movies</h2>
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search movies/TV shows..."
            className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-600"
            onKeyPress={(e) => e.key === 'Enter' && searchMovies()}
          />
          <button
            onClick={searchMovies}
            disabled={loading}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white font-semibold rounded-lg transition-colors"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Search Results */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {tmdbMovies.map((movie) => {
            const imageUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null;
            
            return (
              <div key={movie.id} className="bg-gray-800 rounded-lg p-5 border border-gray-700 hover:transform hover:scale-105 transition-all duration-200 min-h-[480px] flex flex-col">
                <div className="w-full h-80 mb-4 rounded-lg overflow-hidden bg-gray-700 flex items-center justify-center">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={movie.title || movie.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentNode.innerHTML = `
                          <div class="flex flex-col items-center justify-center h-full text-center">
                            <div class="text-4xl mb-2">🎥</div>
                            <span class="text-gray-400 text-sm">No Image</span>
                          </div>
                        `;
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="text-4xl mb-2">🎥</div>
                      <span className="text-gray-400 text-sm">No Image</span>
                    </div>
                  )}
                </div>
                <h3 className="text-white font-medium text-base mb-2 flex-1 leading-tight">
                  {movie.title || movie.name}
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  {(movie.release_date || movie.first_air_date)?.split('-')[0]} • ⭐ {movie.vote_average?.toFixed(1)}
                </p>
                <button
                  onClick={() => addMovieToWebsite(movie)}
                  disabled={addedMovies.some(m => m.tmdbId === movie.id.toString())}
                  className={`w-full py-3 px-4 text-sm font-medium rounded-lg transition-colors ${
                    addedMovies.some(m => m.tmdbId === movie.id.toString())
                      ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {addedMovies.some(m => m.tmdbId === movie.id.toString()) ? 'Already Added' : 'Add to Website'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </LayoutComponent>
  );
};

export default ManageTMDBMovies;