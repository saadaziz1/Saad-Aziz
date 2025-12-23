"use client";

import { Star, Play, Plus, Clock } from "lucide-react";

interface Movie {
  id: string;
  title: string;
  image: string;
  year?: string;
  rating?: number;
  genre?: string;
  timing?: string;
  watching?: string;
}

interface MovieCardProps {
  movie: Movie;
  onPlay?: (movieId: string) => void;
  onWatchlist?: (movieId: string) => void;
  onClick?: (movieId: string) => void;
}

export function MovieCard({ movie, onPlay, onWatchlist, onClick }: MovieCardProps) {
  return (
    <div 
      className="bg-[#1A1A1A] border border-[#262626] rounded-xl p-4 cursor-pointer hover:border-[#404040] transition-colors group"
      onClick={() => onClick?.(movie.id)}
    >
      <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-3">
        <img
          src={movie.image}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300"></div>

        {/* Hover overlay with buttons */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPlay?.(movie.id);
              }}
              className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors"
            >
              <Play className="w-4 h-4 fill-current" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onWatchlist?.(movie.id);
              }}
              className="bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between items-center">
          {movie.timing && (
            <span className="items-center text-xs 3xl:text-lg text-gray-400 flex gap-1 bg-[#141414] border border-[#262626] rounded-full w-fit p-1 3xl:px-3 px-1.5">
              <svg
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.125 0C3.63769 0 0 3.63769 0 8.125C0 12.6123 3.63769 16.25 8.125 16.25C12.6123 16.25 16.25 12.6123 16.25 8.125C16.25 3.63769 12.6123 0 8.125 0ZM8.75 3.125C8.75 2.77982 8.47018 2.5 8.125 2.5C7.77982 2.5 7.5 2.77982 7.5 3.125V8.125C7.5 8.47018 7.77982 8.75 8.125 8.75H11.875C12.2202 8.75 12.5 8.47018 12.5 8.125C12.5 7.77982 12.2202 7.5 11.875 7.5H8.75V3.125Z"
                  fill="#999999"
                />
              </svg>
              {movie.timing}
            </span>
          )}
          {movie.watching && (
            <span className="text-xs 3xl:text-lg text-gray-400 flex items-center gap-1 bg-[#141414] border border-[#262626] rounded-full w-fit p-1 3xl:px-3 px-1.5">
              <svg
                width="18"
                height="14"
                viewBox="0 0 18 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.97217 9.375C10.3529 9.375 11.4722 8.25571 11.4722 6.875C11.4722 5.49429 10.3529 4.375 8.97217 4.375C7.59146 4.375 6.47217 5.49429 6.47217 6.875C6.47217 8.25571 7.59146 9.375 8.97217 9.375Z"
                  fill="#999999"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.0750104 6.41391C1.31439 2.68809 4.82876 0 8.9726 0C13.1145 0 16.6275 2.6856 17.8685 6.40871C17.9687 6.7096 17.9688 7.03515 17.8687 7.33609C16.6294 11.0619 13.115 13.75 8.97114 13.75C4.82923 13.75 1.3162 11.0644 0.0752834 7.34129C-0.0250012 7.04041 -0.0250966 6.71486 0.0750104 6.41391ZM13.3472 6.875C13.3472 9.29125 11.3884 11.25 8.97217 11.25C6.55592 11.25 4.59717 9.29125 4.59717 6.875C4.59717 4.45875 6.55592 2.5 8.97217 2.5C11.3884 2.5 13.3472 4.45875 13.3472 6.875Z"
                  fill="#999999"
                />
              </svg>

              {movie.watching}
            </span>
          )}
          {movie.rating && (
            <span className="text-xs 3xl:text-lg text-gray-400 flex items-center gap-1 bg-[#141414] border border-[#262626] rounded-full w-fit p-1 3xl:px-3 px-1.5">
              <Star className="w-3 h-3 fill-current text-yellow-500" />
              {movie.rating}
            </span>
          )}
        </div>

        {
          
            movie.year && (
            <div className="text-xs 3xl:px-3 3xl:text-lg text-gray-400 mx-auto flex items-center justify-center gap-1 bg-[#141414] border border-[#262626] rounded-full w-fit p-1 px-1.5">
              <span >Released in {movie.year}</span>
              
              
            </div>
          )
          
        }
      </div>
    </div>
  );
}
