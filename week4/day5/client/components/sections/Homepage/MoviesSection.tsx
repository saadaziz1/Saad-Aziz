"use client";

import { MovieCarousel } from "@/components/ui/movie-carousel";
import { MovieCarouselLarge } from "@/components/ui/movie-carousel-large";
import { useMovies } from "@/hooks/useMovies";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/authStore";

interface MoviesSectionProps {
  onPlay?: (movieId: string) => void;
  onWatchlist?: (movieId: string) => void;
  onClick?: (movieId: string) => void;
}

export function MoviesSection({ onPlay, onWatchlist, onClick }: MoviesSectionProps) {
  const { movies } = useMovies();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const handleMovieClick = (movieId: string) => {
    router.push(`/movies/${movieId}`);
    onClick?.(movieId);
  };

  const handlePlay = (movieId: string) => {
    router.push(`/movies/${movieId}`);
    onPlay?.(movieId);
  };

  const handleWatchlist = (movieId: string) => {
    console.log("Adding to watchlist:", movieId);
    onWatchlist?.(movieId);
  };

  if (!Array.isArray(movies) || movies.length === 0) {
    return null;
  }

  // Create movie sections from real data
  const trendingMovies = movies.slice(0, 8).map(movie => ({
    id: movie._id,
    title: movie.title,
    image: movie.thumbnailUrl,
    watching: '2k',
    timing: `${Math.floor(movie.duration / 60)}m`
  }));

  const newReleases = movies.filter(m => m.releaseYear >= 2020).slice(0, 10).map(movie => ({
    id: movie._id,
    title: movie.title,
    image: movie.thumbnailUrl,
    year: movie.releaseYear.toString()
  }));

  const mustWatchMovies = movies.slice(8, 13).map(movie => ({
    id: movie._id,
    title: movie.title,
    image: movie.thumbnailUrl,
    rating: parseFloat((Math.floor(Math.random() * 3) + 6 + Math.random()).toFixed(1)),
    timing: `${Math.floor(movie.duration / 60)}m`
  }));

  return (
    <div className="space-y-8 overflow-hidden">
      {trendingMovies.length > 0 && (
        <MovieCarousel
          title="Trending Now"
          movies={trendingMovies}
          onPlay={handlePlay}
          onWatchlist={handleWatchlist}
          onClick={handleMovieClick}
        />
      )}
      
      {newReleases.length > 0 && (
        <MovieCarousel
          title="New Releases"
          movies={newReleases}
          onPlay={handlePlay}
          onWatchlist={handleWatchlist}
          onClick={handleMovieClick}
        />
      )}
      
      {mustWatchMovies.length > 0 && (
        <MovieCarouselLarge
          title="Must - Watch Movies"
          movies={mustWatchMovies}
          onPlay={handlePlay}
          onWatchlist={handleWatchlist}
          onClick={handleMovieClick}
        />
      )}
    </div>
  );
}