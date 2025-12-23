import React from 'react';
import { useNavigate } from 'react-router-dom';
import { tmdbService } from '../../services/tmdb';

const ApprovedMovieCard = ({ movie }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/watch/tmdb/${movie.mediaType}/${movie.tmdbId}`);
  };

  return (
    <div 
      className="bg-gray-900 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform"
      onClick={handleClick}
    >
      <div className="aspect-[2/3] relative">
        {movie.posterPath ? (
          <img 
            src={tmdbService.getImageUrl(movie.posterPath)} 
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <span className="text-gray-400">No Image</span>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
          ⭐ {movie.voteAverage?.toFixed(1)}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-white font-semibold truncate">{movie.title}</h3>
        <p className="text-gray-400 text-sm">{movie.releaseDate?.split('-')[0]}</p>
      </div>
    </div>
  );
};

export default ApprovedMovieCard;