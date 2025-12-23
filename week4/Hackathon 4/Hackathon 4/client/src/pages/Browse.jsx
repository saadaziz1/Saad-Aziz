import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { videoService, userService } from '../services/auth';
import VideoCard from '../components/Cards/VideoCard';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

const Browse = () => {
  const [videos, setVideos] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const { user } = useAuth();

  const fetchVideos = React.useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedGenre) params.genre = selectedGenre;
      if (searchTerm) params.search = searchTerm;
      
      const response = await videoService.getAllVideos(params);
      setVideos(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch videos');
    } finally {
      setLoading(false);
    }
  }, [selectedGenre, searchTerm]);

  useEffect(() => {
    fetchGenres();
    fetchVideos();
    fetchSubscriptionStatus();
  }, [fetchVideos]);

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await userService.getSubscriptionStatus();
      setSubscriptionStatus(response.data);
    } catch (err) {
      console.error('Failed to fetch subscription status:', err);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await videoService.getGenres();
      setGenres(response.data);
    } catch (err) {
      console.error('Failed to fetch genres:', err);
    }
  };



  return (
    <div className="py-10">
      <div className="container">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-5">Browse Movies & Shows</h1>
          <div className="flex flex-col md:flex-row gap-5">
            <input
              type="text"
              placeholder="Search videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input min-w-[200px]"
            />
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="form-select min-w-[200px]"
            >
              <option value="">All Genres</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading && <LoadingSpinner />}
        {error && <div className="error">{error}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-8">
          {videos.map((video) => (
            <div key={video._id} className="relative">
              <VideoCard video={video} />
              {video.isPremium && (!subscriptionStatus?.isActive) && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-lg">
                  <div className="text-center p-4">
                    <div className="text-yellow-500 text-2xl mb-2">👑</div>
                    <p className="text-white font-semibold mb-2">Premium Content</p>
                    <Link 
                      to="/subscription" 
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm transition-colors"
                    >
                      Subscribe Now
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {!loading && videos.length === 0 && (
          <div className="text-center py-15 text-gray-300">
            <p>No videos found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;