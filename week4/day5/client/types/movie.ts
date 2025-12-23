export interface Movie {
  id: string;
  title: string;
  image: string;
  year?: string;
  rating?: number;
  genre?: string;
}

export interface MovieActions {
  onPlay?: (movieId: string) => void;
  onWatchlist?: (movieId: string) => void;
}