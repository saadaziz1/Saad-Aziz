import React, { useState, useEffect } from 'react';
import { tmdbService } from '../../services/tmdb';
import { tmdbMovieService } from '../../services/tmdbMovieService';
import AdminLayout from './AdminLayout';
import SuperAdminLayout from '../SuperAdmin/SuperAdminLayout';
import { useAuth } from '../../context/AuthContext';

const ManageAddedMovies = () => {
  const { isSuperAdmin } = useAuth();
  const [addedMovies, setAddedMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAddedMovies();
  }, []);

  const fetchAddedMovies = async () => {
    try {
      setLoading(true);
      const response = await tmdbMovieService.getAllMovies();
      setAddedMovies(response.data);
    } catch (error) {
      console.error('Error fetching added movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeMovie = async (id) => {
    if (!window.confirm('Are you sure you want to remove this movie?')) return;
    
    try {
      await tmdbMovieService.removeMovie(id);
      alert('Movie removed successfully!');
      fetchAddedMovies();
    } catch (error) {
      alert('Error removing movie');
    }
  };

  const toggleStatus = async (id) => {
    try {
      await tmdbMovieService.toggleStatus(id);
      fetchAddedMovies();
    } catch (error) {
      alert('Error updating movie status');
    }
  };

  const LayoutComponent = isSuperAdmin ? SuperAdminLayout : AdminLayout;

  if (loading) {
    return (
      <LayoutComponent>
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Loading...</div>
        </div>
      </LayoutComponent>
    );
  }

  return (
    <LayoutComponent>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Added Movies Management</h1>
        <p className="text-gray-400">Manage movies that are currently on your website</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
          <h3 className="text-gray-400 text-sm font-medium mb-2">Total Movies</h3>
          <p className="text-3xl font-bold text-white">{addedMovies.length}</p>
        </div>
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
          <h3 className="text-gray-400 text-sm font-medium mb-2">Active Movies</h3>
          <p className="text-3xl font-bold text-green-500">{addedMovies.filter(m => m.isActive).length}</p>
        </div>
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
          <h3 className="text-gray-400 text-sm font-medium mb-2">Inactive Movies</h3>
          <p className="text-3xl font-bold text-red-500">{addedMovies.filter(m => !m.isActive).length}</p>
        </div>
      </div>

      {/* Movies Grid */}
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-6">All Added Movies</h2>
        
        {addedMovies.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-xl font-semibold text-white mb-2">No Movies Added Yet</h3>
            <p className="text-gray-400">Start by adding movies from the TMDb Movies section</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {addedMovies.map((movie) => {
              const imageUrl = movie.posterPath ? `https://image.tmdb.org/t/p/w500${movie.posterPath}` : null;
              
              return (
                <div key={movie._id} className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:transform hover:scale-105 transition-all duration-200">
                  <div className="relative mb-4">
                    <div className="w-full h-72 rounded-lg overflow-hidden bg-gray-700 flex items-center justify-center">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={movie.title}
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
                    
                    {/* Status Badge */}
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        movie.isActive ? 'bg-green-600 text-green-100' : 'bg-red-600 text-red-100'
                      }`}>
                        {movie.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="text-white font-medium text-base mb-2 leading-tight">
                    {movie.title}
                  </h3>
                  
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                    <span>{movie.releaseDate?.split('-')[0]}</span>
                    <span>⭐ {movie.voteAverage?.toFixed(1)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                    <span className="px-2 py-1 bg-blue-600 text-blue-100 rounded">
                      {movie.mediaType}
                    </span>
                    <span>By: {movie.addedBy?.name}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleStatus(movie._id)}
                      className={`flex-1 py-2 px-3 text-xs font-medium rounded transition-colors ${
                        movie.isActive 
                          ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {movie.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => removeMovie(movie._id)}
                      className="flex-1 py-2 px-3 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </LayoutComponent>
  );
};

export default ManageAddedMovies;