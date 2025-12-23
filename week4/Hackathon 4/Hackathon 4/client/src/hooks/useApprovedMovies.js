import { useState, useEffect } from 'react';
import { tmdbMovieService } from '../services/tmdbMovieService';

export const useApprovedMovies = () => {
  const [approvedMovies, setApprovedMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApprovedMovies = async () => {
      try {
        const response = await tmdbMovieService.getActiveMovies();
        setApprovedMovies(response.data || []);
      } catch (error) {
        console.error('Error fetching approved movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedMovies();
  }, []);

  return { approvedMovies, loading };
};