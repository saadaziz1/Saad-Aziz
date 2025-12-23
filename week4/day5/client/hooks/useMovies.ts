import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useMovieStore } from '../lib/movieStore';
import { Movie } from '../types';

export const useMovies = () => {
  const { setMovies, setCurrentMovie, setLoading, setError } = useMovieStore();

  const moviesQuery = useQuery({
    queryKey: ['movies'],
    queryFn: async (): Promise<Movie[]> => {
      setLoading(true);
      try {
        const response = await api.get('/videos');
        const movies = response.data.data || response.data;
        // Sort movies by creation date (newest first)
        const sortedMovies = movies.sort((a: any, b: any) => {
          const dateA = new Date(a.createdAt || a._id).getTime();
          const dateB = new Date(b.createdAt || b._id).getTime();
          return dateB - dateA;
        });
        setMovies(sortedMovies);
        setError(null);
        return sortedMovies;
      } catch (error: any) {
        setError(error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
  });

  const getMovie = (id: string) => useQuery({
    queryKey: ['movie', id],
    queryFn: async (): Promise<Movie> => {
      setLoading(true);
      try {
        const response = await api.get(`/videos/${id}`);
        const movie = response.data.data || response.data;
        setCurrentMovie(movie);
        setError(null);
        return movie;
      } catch (error: any) {
        setError(error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    enabled: !!id,
  });

  const getStreamUrl = (id: string) => useQuery({
    queryKey: ['stream', id],
    queryFn: async (): Promise<string> => {
      try {
        const response = await api.get(`/videos/stream/${id}`);
        return response.data.videoUrl || '';
      } catch (error) {
        return '';
      }
    },
    enabled: !!id,
  });

  return {
    movies: moviesQuery.data || [],
    isMoviesLoading: moviesQuery.isLoading,
    moviesError: moviesQuery.error,
    getMovie,
    getStreamUrl,
  };
};