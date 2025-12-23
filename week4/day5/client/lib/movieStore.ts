import { create } from 'zustand';
import { Movie } from '../types';

interface MovieState {
  movies: Movie[];
  currentMovie: Movie | null;
  loading: boolean;
  error: string | null;
  setMovies: (movies: Movie[]) => void;
  setCurrentMovie: (movie: Movie | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addMovie: (movie: Movie) => void;
  updateMovie: (id: string, movie: Partial<Movie>) => void;
  removeMovie: (id: string) => void;
}

export const useMovieStore = create<MovieState>((set) => ({
  movies: [],
  currentMovie: null,
  loading: false,
  error: null,
  setMovies: (movies) => set({ movies }),
  setCurrentMovie: (movie) => set({ currentMovie: movie }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  addMovie: (movie) => set((state) => ({ movies: [...state.movies, movie] })),
  updateMovie: (id, updatedMovie) => set((state) => ({
    movies: state.movies.map(movie => 
      movie._id === id ? { ...movie, ...updatedMovie } : movie
    )
  })),
  removeMovie: (id) => set((state) => ({
    movies: state.movies.filter(movie => movie._id !== id)
  })),
}));