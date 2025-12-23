"use client";

import { useMovies } from '@/hooks/useMovies';
import { FreeTrialSection } from '@/components/sections/Homepage/FreeTrialSection';
import { HeroCarousel } from '@/components/ui/hero-carousel';
import { CategoriesSection } from '@/components/sections/Homepage/CategoriesSection';
import { Button } from '@/components/ui/button';
import { CategoriesSectionLarge } from '@/components/sections/Homepage/CategoriesSectionLarge';
import { MoviesSection } from '@/components/sections/Homepage/MoviesSection';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/lib/authStore';
import { ArrowLeft } from 'lucide-react';
import { MovieCarousel } from '@/components/ui/movie-carousel';
import { useMemo, Suspense } from 'react';

function MoviesContent() {
  const { movies, isMoviesLoading } = useMovies();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const genreFilter = searchParams.get('genre');
  const showGenreFilter = searchParams.get('showGenre');
  const contentType = searchParams.get('type'); // 'movies' or 'shows'

  // Filter movies by genre if specified
  const filteredMovies = useMemo(() => {
    if (!genreFilter || !Array.isArray(movies)) return movies;
    return movies.filter(movie => movie.genre === genreFilter);
  }, [movies, genreFilter]);

  // Filter shows by genre if specified
  const filteredShows = useMemo(() => {
    if (!showGenreFilter || !Array.isArray(movies)) return movies;
    return movies.filter(movie => movie.genre === showGenreFilter);
  }, [movies, showGenreFilter]);

  // Create hero slides from filtered or all movies
  const heroSlides = Array.isArray(filteredMovies) && filteredMovies.length > 0 ? filteredMovies.slice(0, 4).map(movie => ({
    id: movie._id,
    title: movie.title,
    description: movie.description,
    backgroundImage: movie.thumbnailUrl
  })) : [];

  // Create movie categories from backend data
  const movieCategories = Array.isArray(movies) && movies.length > 0 ? [
    { title: "Action", movies: movies.filter(m => m.genre === "Action").slice(0, 4) },
    { title: "Comedy", movies: movies.filter(m => m.genre === "Comedy").slice(0, 4) },
    { title: "Drama", movies: movies.filter(m => m.genre === "Drama").slice(0, 4) },
    { title: "Horror", movies: movies.filter(m => m.genre === "Horror").slice(0, 4) },
    { title: "Romance", movies: movies.filter(m => m.genre === "Romance").slice(0, 4) },
    { title: "Thriller", movies: movies.filter(m => m.genre === "Thriller").slice(0, 4) },
    { title: "Sci-Fi", movies: movies.filter(m => m.genre === "Sci-Fi").slice(0, 4) },
    { title: "Fantasy", movies: movies.filter(m => m.genre === "Fantasy").slice(0, 4) },
    { title: "Animation", movies: movies.filter(m => m.genre === "Animation").slice(0, 4) },
    { title: "Documentary", movies: movies.filter(m => m.genre === "Documentary").slice(0, 4) }
  ].filter(category => category.movies.length > 0) : [];

  const topCategories = movieCategories.map(cat => ({ ...cat, top: "Top 10 in" }));

  const handlePlay = (slideId: string) => {
    if (isAuthenticated) {
      router.push(`/watch/${slideId}`);
    } else {
      router.push('/auth/login');
    }
  };

  const handleMovieClick = (movieId: string) => {
    router.push(`/movies/${movieId}`);
  };

  const handleWatchlist = (slideId: string) => {
    console.log('Add to watchlist:', slideId);
  };

  const handleFreeTrialClick = () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  };

  if (isMoviesLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading movies...</div>
      </div>
    );
  }

  return (
    <>
      <main className="max-w-350 3xl:max-w-400 mx-auto px-4 py-8 mt-20 3xl:mt-30">
        {heroSlides.length > 0 && (
          <HeroCarousel
            slides={heroSlides}
            onPlay={handlePlay}
            onWatchlist={handleWatchlist}
          />
        )}
        
        {(genreFilter || showGenreFilter) ? (
          // Show only the filtered section
          genreFilter ? (
            <section className='relative border border-[#262626] rounded-2xl mt-25 pt-10 pb-10 px-10'>
              <button
                onClick={() => router.back()}
                className="absolute top-10 left-8 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <Button className='absolute text-base 3xl:text-lg bg-red-600 -top-4 px-5 py-2 z-20'>
                {genreFilter} Movies
              </Button>
              <div className="space-y-8 mt-8">
                <MovieCarousel
                  title={`${genreFilter} Movies`}
                  movies={filteredMovies.map(movie => ({
                    id: movie._id,
                    title: movie.title,
                    image: movie.thumbnailUrl,
                    year: movie.releaseYear.toString()
                  }))}
                  onPlay={handlePlay}
                  onWatchlist={handleWatchlist}
                  onClick={handleMovieClick}
                />
                <MovieCarousel
                  title="Trending Now"
                  movies={filteredMovies.slice(0, 10).map(movie => ({
                    id: movie._id,
                    title: movie.title,
                    image: movie.thumbnailUrl,
                    year: movie.releaseYear.toString()
                  }))}
                  onPlay={handlePlay}
                  onWatchlist={handleWatchlist}
                  onClick={handleMovieClick}
                />
                <MovieCarousel
                  title="New Releases"
                  movies={filteredMovies.slice(0, 8).map(movie => ({
                    id: movie._id,
                    title: movie.title,
                    image: movie.thumbnailUrl,
                    year: movie.releaseYear.toString()
                  }))}
                  onPlay={handlePlay}
                  onWatchlist={handleWatchlist}
                  onClick={handleMovieClick}
                />
                <MovieCarousel
                  title="Must Watch"
                  movies={filteredMovies.slice(2, 12).map(movie => ({
                    id: movie._id,
                    title: movie.title,
                    image: movie.thumbnailUrl,
                    year: movie.releaseYear.toString()
                  }))}
                  onPlay={handlePlay}
                  onWatchlist={handleWatchlist}
                  onClick={handleMovieClick}
                />
              </div>
            </section>
          ) : (
            <section className='relative border border-[#262626] rounded-2xl mt-25 pt-10 pb-10 px-10'>
              <button
                onClick={() => router.back()}
                className="absolute top-10 left-8 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <Button className='absolute text-base 3xl:text-lg bg-red-600 -top-4 px-5 py-2 z-20'>
                {showGenreFilter} Shows
              </Button>
              <div className="space-y-8 mt-8">
                <MovieCarousel
                  title={`${showGenreFilter} Shows`}
                  movies={filteredShows.map(movie => ({
                    id: movie._id,
                    title: movie.title,
                    image: movie.thumbnailUrl,
                    year: movie.releaseYear.toString()
                  }))}
                  onPlay={handlePlay}
                  onWatchlist={handleWatchlist}
                  onClick={handleMovieClick}
                />
                <MovieCarousel
                  title="Trending Shows"
                  movies={filteredShows.slice(0, 10).map(movie => ({
                    id: movie._id,
                    title: movie.title,
                    image: movie.thumbnailUrl,
                    year: movie.releaseYear.toString()
                  }))}
                  onPlay={handlePlay}
                  onWatchlist={handleWatchlist}
                  onClick={handleMovieClick}
                />
                <MovieCarousel
                  title="New Show Releases"
                  movies={filteredShows.slice(0, 8).map(movie => ({
                    id: movie._id,
                    title: movie.title,
                    image: movie.thumbnailUrl,
                    year: movie.releaseYear.toString()
                  }))}
                  onPlay={handlePlay}
                  onWatchlist={handleWatchlist}
                  onClick={handleMovieClick}
                />
                <MovieCarousel
                  title="Must Watch Shows"
                  movies={filteredShows.slice(2, 12).map(movie => ({
                    id: movie._id,
                    title: movie.title,
                    image: movie.thumbnailUrl,
                    year: movie.releaseYear.toString()
                  }))}
                  onPlay={handlePlay}
                  onWatchlist={handleWatchlist}
                  onClick={handleMovieClick}
                />
              </div>
            </section>
          )
        ) : (
          // Show both sections when no filter
          <>
            <section className='relative border border-[#262626] rounded-2xl mt-25 pt-10 pb-10 px-10'>
              <Button className='absolute text-base 3xl:text-lg bg-red-600 -top-4 px-5 py-2 z-20'>
                Movies
              </Button>
              {movieCategories.length > 0 ? (
                <>
                  <CategoriesSection categoriesData={movieCategories} title="Our Genres" sectionType="movies"/>
                  <CategoriesSectionLarge categoriesData={topCategories} title="Popular Top 10 in Genres" sectionType="movies"/>
                </>
              ) : (
                <div className="text-center text-gray-400 py-8">
                  No movies available
                </div>
              )}
              <MoviesSection onClick={handleMovieClick} />
            </section>

            <section className='relative border border-[#262626] rounded-2xl mt-25 pt-10 pb-10 px-10'>
              <Button className='absolute text-base 3xl:text-lg bg-red-600 -top-4 px-5 py-2 z-20'>
                Shows
              </Button>
              {movieCategories.length > 0 ? (
                <>
                  <CategoriesSection categoriesData={movieCategories} title="Our Genres" sectionType="shows"/>
                  <CategoriesSectionLarge categoriesData={topCategories} title="Popular Top 10 in Genres" sectionType="shows"/>
                </>
              ) : (
                <div className="text-center text-gray-400 py-8">
                  No Shows available
                </div>
              )}
              <MoviesSection onClick={handleMovieClick} />
            </section>
          </>
        )}
      </main>
      
      <FreeTrialSection onStartTrial={handleFreeTrialClick} />
    </>
  )
}

const page = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading movies...</div>
      </div>
    }>
      <MoviesContent />
    </Suspense>
  )
}

export default page
