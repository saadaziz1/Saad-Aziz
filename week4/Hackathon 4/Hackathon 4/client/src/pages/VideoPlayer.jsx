import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { videoService } from '../services/auth';
import { tmdbService } from '../services/tmdb';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const VideoPlayer = () => {
  const { id, type } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [tmdbData, setTmdbData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const isTmdbContent = window.location.pathname.includes('/tmdb/');

  useEffect(() => {
    if (isTmdbContent) {
      fetchTmdbData();
    } else {
      fetchVideo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, type]);

  const fetchTmdbData = async () => {
    try {
      setLoading(true);
      let data;
      if (type === 'movie') {
        data = await tmdbService.getMovieDetails(id);
      } else {
        data = await tmdbService.getTVDetails(id);
      }
      setTmdbData(data);
    } catch (err) {
      setError('Failed to load content details');
    } finally {
      setLoading(false);
    }
  };

  const fetchVideo = async () => {
    try {
      setLoading(true);
      const response = await videoService.getVideoById(id);
      setVideo(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load video');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error">{error}</div>;
  
  const currentData = isTmdbContent ? tmdbData : video;
  if (!currentData) return <div className="error">Content not found</div>;
  
  const title = isTmdbContent ? (currentData.title || currentData.name) : currentData.title;
  const description = isTmdbContent ? currentData.overview : currentData.description;
  const backdrop = isTmdbContent ? tmdbService.getImageUrl(currentData.backdrop_path, 'w1280') : currentData.thumbnail;
  const releaseYear = isTmdbContent ? (currentData.release_date || currentData.first_air_date)?.split('-')[0] : currentData.releaseYear;

  const castMembers = [
    { name: 'Rishab Shetty', role: 'From India', image: '/9c7005363bfabd9a9e5caf02283cd49a3b489039.png' },
    { name: 'Sapthami Gowda', role: 'From India', image: '/a64d1b88a8dd8da8026c6929632e8d9ccfec9248.png' },
    { name: 'Kishore Kumar', role: 'From India', image: '/bc1b5bc32def46b923a7170f094fdefa7712dd78.png' },
    { name: 'Achyuth Kumar', role: 'From India', image: '/c17ebbe4ef83c575c67d51da6e2a5bce5db35bf4.png' },
    { name: 'Pramod Shetty', role: 'From India', image: '/9c7005363bfabd9a9e5caf02283cd49a3b489039.png' },
    { name: 'Vinay Bidappa', role: 'From India', image: '/a64d1b88a8dd8da8026c6929632e8d9ccfec9248.png' },
    { name: 'Naveen D Padil', role: 'From India', image: '/bc1b5bc32def46b923a7170f094fdefa7712dd78.png' },
    { name: 'Deepak Rai', role: 'From India', image: '/c17ebbe4ef83c575c67d51da6e2a5bce5db35bf4.png' }
  ];

  const reviews = [
    {
      name: 'Anilkot Roy',
      location: 'From India',
      rating: 4.5,
      review: 'This movie was recommended to me by a very dear friend who went to the movie by himself. I went to the cinemas to watch but had a wonderful board so couldn\'t watch it.'
    },
    {
      name: 'Swaraj',
      location: 'From India', 
      rating: 5,
      review: 'A restless king promises his lands to the local tribals in exchange of a stone (Panjurli), a deity of Keradi Village, wherein the tribal police and peace of mind.'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={backdrop || '/9c7005363bfabd9a9e5caf02283cd49a3b489039.png'} 
            alt={title} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/60 to-black/90"></div>
        
        <div className="absolute bottom-20 left-0 right-0">
          <div className="container mx-auto px-5">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{title}</h1>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                {description || 'A fiery young man clashes with an unflinching forest officer in a south Indian village where spirituality, fate and folklore rule the lands.'}
              </p>
              <div className="flex items-center gap-4 mb-8">
                {!isTmdbContent ? (
                  <button 
                    onClick={() => {
                      const videoElement = document.createElement('video');
                      videoElement.src = `http://localhost:5000${video.videoUrl}`;
                      videoElement.controls = true;
                      videoElement.autoplay = true;
                      videoElement.className = 'w-full h-96 bg-black rounded-lg';
                      
                      const playerContainer = document.getElementById('video-player-container');
                      playerContainer.innerHTML = '';
                      playerContainer.appendChild(videoElement);
                      playerContainer.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
                  >
                    <span>▶</span> Play Now
                  </button>
                ) : (
                  <button 
                    onClick={() => alert('This is TMDb content. Actual video streaming requires licensing.')}
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
                  >
                    <span>▶</span> Watch Trailer
                  </button>
                )}
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

      {/* Video Player Container */}
      <div id="video-player-container" className="container mx-auto px-5 py-8"></div>

      {/* Content Section */}
      <div className="container mx-auto px-5 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Description & Cast */}
          <div className="lg:col-span-2">
            {/* Description */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Description</h2>
              <p className="text-gray-300 leading-relaxed">
                {description || 'A fiery young man clashes with an unflinching forest officer in a south Indian village where spirituality, fate and folklore rule the lands.'}
              </p>
            </div>

            {/* Cast */}
            <div className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Cast</h2>
                <div className="flex gap-2">
                  <button className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                    <span>←</span>
                  </button>
                  <button className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                    <span>→</span>
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                {(isTmdbContent && tmdbData?.credits?.cast ? tmdbData.credits.cast.slice(0, 8) : castMembers).map((member, index) => (
                  <div key={index} className="text-center">
                    <img 
                      src={isTmdbContent && member.profile_path ? tmdbService.getImageUrl(member.profile_path) : (member.image || '/9c7005363bfabd9a9e5caf02283cd49a3b489039.png')} 
                      alt={isTmdbContent ? member.name : member.name} 
                      className="w-16 h-16 rounded-full object-cover mx-auto mb-2"
                    />
                    <p className="text-sm font-medium">{isTmdbContent ? member.name : member.name}</p>
                    <p className="text-xs text-gray-400">{isTmdbContent ? member.character : member.role}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Reviews</h2>
                <button className="text-red-600 hover:text-red-500 font-medium transition-colors flex items-center gap-2">
                  <span>+</span> Add Your Review
                </button>
              </div>
              <div className="space-y-6">
                {reviews.map((review, index) => (
                  <div key={index} className="bg-gray-900 rounded-lg p-6">
                    <div className="flex items-start gap-4">
                      <img 
                        src={castMembers[index]?.image || '/9c7005363bfabd9a9e5caf02283cd49a3b489039.png'} 
                        alt={review.name} 
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold">{review.name}</h4>
                          <span className="text-gray-400 text-sm">{review.location}</span>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`text-sm ${i < review.rating ? 'text-red-600' : 'text-gray-600'}`}>★</span>
                            ))}
                            <span className="text-sm text-gray-400 ml-1">{review.rating}</span>
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">{review.review}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-8">
                <div className="flex gap-2">
                  <button className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                    <span>←</span>
                  </button>
                  <div className="flex items-center gap-1 px-4">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                  </div>
                  <button className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Movie Info */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-lg p-6 sticky top-6">
              {/* Released Year */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-400">📅</span>
                  <span className="text-gray-400 text-sm">Released Year</span>
                </div>
                <p className="font-semibold">{releaseYear || '2022'}</p>
              </div>

              {/* Available Languages */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-400">🌐</span>
                  <span className="text-gray-400 text-sm">Available Languages</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-gray-800 px-3 py-1 rounded text-sm">English</span>
                  <span className="bg-gray-800 px-3 py-1 rounded text-sm">Hindi</span>
                  <span className="bg-gray-800 px-3 py-1 rounded text-sm">Tamil</span>
                  <span className="bg-gray-800 px-3 py-1 rounded text-sm">Telugu</span>
                </div>
                <p className="text-sm text-gray-400 mt-2">Kannada</p>
              </div>

              {/* Ratings */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-400">⭐</span>
                  <span className="text-gray-400 text-sm">Ratings</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">IMDb</span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-red-600 text-sm">★</span>
                      ))}
                      <span className="text-sm ml-1">4.5</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Streamvibe</span>
                    <div className="flex items-center gap-1">
                      {[...Array(4)].map((_, i) => (
                        <span key={i} className="text-red-600 text-sm">★</span>
                      ))}
                      <span className="text-gray-600 text-sm">★</span>
                      <span className="text-sm ml-1">4</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Genres */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-400">🎭</span>
                  <span className="text-gray-400 text-sm">Genres</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-gray-800 px-3 py-1 rounded text-sm">{isTmdbContent ? (tmdbData?.genres?.[0]?.name || 'Action') : (video?.genre || 'Action')}</span>
                  <span className="bg-gray-800 px-3 py-1 rounded text-sm">Adventure</span>
                </div>
              </div>

              {/* Director */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-400">🎬</span>
                  <span className="text-gray-400 text-sm">Director</span>
                </div>
                <div className="flex items-center gap-3">
                  <img 
                    src="/9c7005363bfabd9a9e5caf02283cd49a3b489039.png" 
                    alt="Director" 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-sm">Rishab Shetty</p>
                    <p className="text-xs text-gray-400">From India</p>
                  </div>
                </div>
              </div>

              {/* Music */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-400">🎵</span>
                  <span className="text-gray-400 text-sm">Music</span>
                </div>
                <div className="flex items-center gap-3">
                  <img 
                    src="/a64d1b88a8dd8da8026c6929632e8d9ccfec9248.png" 
                    alt="Music Director" 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-sm">B. Ajaneesh Loknath</p>
                    <p className="text-xs text-gray-400">From India</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-red-600/20 to-red-600/10">
        <div className="container mx-auto px-5 text-center">
          <h2 className="text-3xl font-bold mb-4">Start your free trial today!</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            This is a clear and concise call to action that encourages users to sign up for a free trial of StreamVibe.
          </p>
          <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
            Start Free Trial
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;