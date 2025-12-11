import { useState, useCallback } from 'react';
import { projectsAPI } from '../../services/projects.api';
import { useProjectStore } from '../../stores/projectStore';

export const useProjects = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { projects, setProjects, addProject, updateProject, deleteProject } = useProjectStore();

  const fetchProjects = useCallback(async () => {
    if (projects.length > 0) return projects;
    setLoading(true);
    setError(null);
    try {
      const { data } = await projectsAPI.getAll();
      setProjects(data.data);
      return data.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [projects.length, setProjects]);

  const createProject = async (projectData) => {
    setLoading(true);
    try {
      const { data } = await projectsAPI.create(projectData);
      addProject(data.data);
      return data.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editProject = async (id, projectData) => {
    setLoading(true);
    try {
      const { data } = await projectsAPI.update(id, projectData);
      updateProject(id, data.data);
      return data.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeProject = async (id) => {
    setLoading(true);
    try {
      await projectsAPI.delete(id);
      deleteProject(id);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getProjectById = useCallback((id) => {
    return projects.find(p => p._id === id);
  }, [projects]);

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    editProject,
    removeProject,
    getProjectById,
  };
};