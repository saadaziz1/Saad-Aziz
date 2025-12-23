import { useState, useEffect } from 'react';
import { tmdbService } from '../services/tmdb';

export const useTMDB = () => {
  const [movies, setMovies] = useState([]);
  const [tvShows, setTVShows] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesData, tvData, trendingData] = await Promise.all([
          tmdbService.getPopularMovies(),
          tmdbService.getPopularTVShows(),
          tmdbService.getTrending()
        ]);

        setMovies(moviesData.results || []);
        setTVShows(tvData.results || []);
        setTrending(trendingData.results || []);
      } catch (error) {
        console.error('Error fetching TMDB data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { movies, tvShows, trending, loading };
};