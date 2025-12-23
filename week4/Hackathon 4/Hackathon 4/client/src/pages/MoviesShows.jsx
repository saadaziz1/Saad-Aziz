import React, { useState, useEffect } from 'react';
import { videoService } from '../services/auth';
import { useApprovedMovies } from '../hooks/useApprovedMovies';
import VideoCard from '../components/Cards/VideoCard';
import ApprovedMovieCard from '../components/Cards/ApprovedMovieCard';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const MoviesShows = () => {
  const [videos, setVideos] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { approvedMovies, loading: approvedLoading } = useApprovedMovies();

  const fetchVideos = React.useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedGenre) params.genre = selectedGenre;
      
      const response = await videoService.getAllVideos(params);
      setVideos(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch videos');
    } finally {
      setLoading(false);
    }
  }, [selectedGenre]);

  useEffect(() => {
    fetchGenres();
    fetchVideos();
  }, [fetchVideos]);

  const fetchGenres = async () => {
    try {
      const response = await videoService.getGenres();
      setGenres(response.data);
    } catch (err) {
      console.error('Failed to fetch genres:', err);
    }
  };

  // Group videos by category for display
  const groupedVideos = {
    ourGenres: videos.slice(0, 8),
    popularTop10: videos.filter(v => v.rating >= 4).slice(0, 8),
    trendingNow: videos.slice(8, 16),
    newReleases: videos.filter(v => new Date(v.createdAt) > new Date(Date.now() - 30*24*60*60*1000)).slice(0, 8),
    mustWatch: videos.filter(v => v.isPremium).slice(0, 4)
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[80vh] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/movies-shows-hero-img.png" 
            alt="Movies & Shows Hero" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/60 to-black/90"></div>
        
        <div className="absolute bottom-20 left-0 right-0">
          <div className="container mx-auto px-5">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">Avengers : Endgame</h1>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                With the help of remaining allies, the Avengers must assemble once more in order to undo Thanos's actions and undo the chaos to the universe, no matter what consequences may be in store, and no matter who they face... Avenge the fallen.
              </p>
              <div className="flex items-center gap-4 mb-8">
                <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2">
                  <span>▶</span> Play Now
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2">
                  <span>+</span>
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2">
                  <span>👍</span>
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2">
                  <span>🔊</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="bg-black text-white py-20">
        {/* Featured Movies & Shows */}
        <div className="container mx-auto px-5 mb-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Featured Movies & Shows</h2>
            </div>
          </div>
          
          {approvedLoading ? (
            <LoadingSpinner />
          ) : approvedMovies.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {approvedMovies.map((movie) => (
                <ApprovedMovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">
              <p>No movies available yet. Admin will add content soon!</p>
            </div>
          )}
        </div>

        {/* Our Genres Section */}
        <div className="container mx-auto px-5 mb-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Our Genres</h2>
            </div>
            <div className="flex gap-2">
              <button className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors">
                <span>←</span>
              </button>
              <button className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors">
                <span>→</span>
              </button>
            </div>
          </div>
          
          {loading && <LoadingSpinner />}
          {error && <div className="error">{error}</div>}
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {groupedVideos.ourGenres.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        </div>

        {/* Popular Top 10 in Genres */}
        <div className="container mx-auto px-5 mb-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Popular Top 10 In Genres</h2>
            </div>
            <div className="flex gap-2">
              <button className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors">
                <span>←</span>
              </button>
              <button className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors">
                <span>→</span>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Action Genre */}
            <div className="relative group cursor-pointer">
              <div className="grid grid-cols-2 gap-2 mb-4">
                <img src="/9c7005363bfabd9a9e5caf02283cd49a3b489039.png" alt="Action Movie" className="w-full h-32 object-cover rounded-lg" />
                <img src="/a64d1b88a8dd8da8026c6929632e8d9ccfec9248.png" alt="Action Movie" className="w-full h-32 object-cover rounded-lg" />
                <img src="/bc1b5bc32def46b923a7170f094fdefa7712dd78.png" alt="Action Movie" className="w-full h-32 object-cover rounded-lg" />
                <img src="/c17ebbe4ef83c575c67d51da6e2a5bce5db35bf4.png" alt="Action Movie" className="w-full h-32 object-cover rounded-lg" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold mb-2 inline-block">Top 10 In</span>
                  <h3 className="text-white font-semibold">Action</h3>
                </div>
                <button className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                  <span className="text-white">→</span>
                </button>
              </div>
            </div>
            
            {/* Adventure Genre */}
            <div className="relative group cursor-pointer">
              <div className="grid grid-cols-2 gap-2 mb-4">
                <img src="/a64d1b88a8dd8da8026c6929632e8d9ccfec9248.png" alt="Adventure Movie" className="w-full h-32 object-cover rounded-lg" />
                <img src="/bc1b5bc32def46b923a7170f094fdefa7712dd78.png" alt="Adventure Movie" className="w-full h-32 object-cover rounded-lg" />
                <img src="/c17ebbe4ef83c575c67d51da6e2a5bce5db35bf4.png" alt="Adventure Movie" className="w-full h-32 object-cover rounded-lg" />
                <img src="/9c7005363bfabd9a9e5caf02283cd49a3b489039.png" alt="Adventure Movie" className="w-full h-32 object-cover rounded-lg" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold mb-2 inline-block">Top 10 In</span>
                  <h3 className="text-white font-semibold">Adventure</h3>
                </div>
                <button className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                  <span className="text-white">→</span>
                </button>
              </div>
            </div>
            
            {/* Comedy Genre */}
            <div className="relative group cursor-pointer">
              <div className="grid grid-cols-2 gap-2 mb-4">
                <img src="/bc1b5bc32def46b923a7170f094fdefa7712dd78.png" alt="Comedy Movie" className="w-full h-32 object-cover rounded-lg" />
                <img src="/c17ebbe4ef83c575c67d51da6e2a5bce5db35bf4.png" alt="Comedy Movie" className="w-full h-32 object-cover rounded-lg" />
                <img src="/9c7005363bfabd9a9e5caf02283cd49a3b489039.png" alt="Comedy Movie" className="w-full h-32 object-cover rounded-lg" />
                <img src="/a64d1b88a8dd8da8026c6929632e8d9ccfec9248.png" alt="Comedy Movie" className="w-full h-32 object-cover rounded-lg" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold mb-2 inline-block">Top 10 In</span>
                  <h3 className="text-white font-semibold">Comedy</h3>
                </div>
                <button className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                  <span className="text-white">→</span>
                </button>
              </div>
            </div>
            
            {/* Drama Genre */}
            <div className="relative group cursor-pointer">
              <div className="grid grid-cols-2 gap-2 mb-4">
                <img src="/c17ebbe4ef83c575c67d51da6e2a5bce5db35bf4.png" alt="Drama Movie" className="w-full h-32 object-cover rounded-lg" />
                <img src="/9c7005363bfabd9a9e5caf02283cd49a3b489039.png" alt="Drama Movie" className="w-full h-32 object-cover rounded-lg" />
                <img src="/a64d1b88a8dd8da8026c6929632e8d9ccfec9248.png" alt="Drama Movie" className="w-full h-32 object-cover rounded-lg" />
                <img src="/bc1b5bc32def46b923a7170f094fdefa7712dd78.png" alt="Drama Movie" className="w-full h-32 object-cover rounded-lg" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold mb-2 inline-block">Top 10 In</span>
                  <h3 className="text-white font-semibold">Drama</h3>
                </div>
                <button className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                  <span className="text-white">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Trending Now */}
        <div className="container mx-auto px-5 mb-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Trending Now</h2>
            </div>
            <div className="flex gap-2">
              <button className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors">
                <span>←</span>
              </button>
              <button className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors">
                <span>→</span>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Movie 1 */}
            <div className="relative group cursor-pointer">
              <img src="/9c7005363bfabd9a9e5caf02283cd49a3b489039.png" alt="Trending Movie" className="w-full h-80 object-cover rounded-lg" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center gap-2 text-gray-300 text-sm mb-2">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    1h 30min
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    2K
                  </span>
                </div>
              </div>
            </div>
            
            {/* Movie 2 */}
            <div className="relative group cursor-pointer">
              <img src="/a64d1b88a8dd8da8026c6929632e8d9ccfec9248.png" alt="Trending Movie" className="w-full h-80 object-cover rounded-lg" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center gap-2 text-gray-300 text-sm mb-2">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    1h 57min
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    1.5K
                  </span>
                </div>
              </div>
            </div>
            
            {/* Movie 3 */}
            <div className="relative group cursor-pointer">
              <img src="/bc1b5bc32def46b923a7170f094fdefa7712dd78.png" alt="Trending Movie" className="w-full h-80 object-cover rounded-lg" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center gap-2 text-gray-300 text-sm mb-2">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    2h 10min
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    1.8K
                  </span>
                </div>
              </div>
            </div>
            
            {/* Movie 4 */}
            <div className="relative group cursor-pointer">
              <img src="/c17ebbe4ef83c575c67d51da6e2a5bce5db35bf4.png" alt="Trending Movie" className="w-full h-80 object-cover rounded-lg" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center gap-2 text-gray-300 text-sm mb-2">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    2h 20min
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    3K
                  </span>
                </div>
              </div>
            </div>
            
            {/* Movie 5 */}
            <div className="relative group cursor-pointer">
              <img src="/9c7005363bfabd9a9e5caf02283cd49a3b489039.png" alt="Trending Movie" className="w-full h-80 object-cover rounded-lg" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center gap-2 text-gray-300 text-sm mb-2">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    1h 42min
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    5K
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* New Releases */}
        <div className="container mx-auto px-5 mb-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">New Releases</h2>
            </div>
            <div className="flex gap-2">
              <button className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors">
                <span>←</span>
              </button>
              <button className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors">
                <span>→</span>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {groupedVideos.newReleases.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        </div>

        {/* Must - Watch Movies */}
        <div className="container mx-auto px-5 mb-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Must - Watch Movies</h2>
            </div>
            <div className="flex gap-2">
              <button className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors">
                <span>←</span>
              </button>
              <button className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors">
                <span>→</span>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {groupedVideos.mustWatch.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        </div>

        {/* Genre Filter Section */}
        <div className="container mx-auto px-5 mb-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Browse by Genre</h2>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 mb-8">
            <button
              onClick={() => setSelectedGenre('')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedGenre === '' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              All Genres
            </button>
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedGenre === genre 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-20 bg-gradient-to-r from-red-600/20 to-red-600/10">
          <div className="container mx-auto px-5 text-center">
            <h2 className="text-3xl font-bold mb-4">Start your free trial today!</h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              This is a clear and concise call to action that encourages users to sign up for a free trial StreamVibe.
            </p>
            <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
              Start Free Trial
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoviesShows;