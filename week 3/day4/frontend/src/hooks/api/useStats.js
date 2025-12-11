import { useState } from 'react';
import { projectsAPI } from '../../services/projects.api';

export const useStats = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await projectsAPI.getStats();
      const statsData = [
        { 
          title: "Total Projects", 
          value: data.data.totalProjects || 0, 
          
        },
        { 
          title: "Active Projects", 
          value: data.data.activeProjects || 0, 
          
        },
        { 
          title: "Completed Projects", 
          value: data.data.completedProjects || 0, 
          
        },
        { 
          title: "Total Members", 
          value: data.data.teamSize || 0, 
         
        },
      ];
      setStats(statsData);
      return statsData;
    } catch (err) {
      setError(err.message);
      // Fallback to empty stats
      const fallbackStats = [
        { title: "Total Projects", value: 0, },
        { title: "Active Projects", value: 0, },
        { title: "Completed Projects", value: 0, },
        { title: "Total Members", value: 0, },
      ];
      setStats(fallbackStats);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    loading,
    error,
    fetchStats,
  };
};