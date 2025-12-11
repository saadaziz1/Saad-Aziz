import { useState, useCallback } from 'react';
import { memberAPI } from '../../services/member.api';
import { useMemberStore } from '../../stores/memberStore';

export const useMembers = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { members, setMembers, addMember, updateMember, deleteMember } = useMemberStore();

  const fetchMembers = useCallback(async () => {
    if (members.length > 0) return members;
    setLoading(true);
    setError(null);
    try {
      const { data } = await memberAPI.getAll();
      setMembers(data.data);
      return data.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [members.length, setMembers]);

  const createMember = async (memberData) => {
    setLoading(true);
    try {
      const { data } = await memberAPI.create(memberData);
      addMember(data.data);
      return data.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editMember = async (id, memberData) => {
    setLoading(true);
    try {
      const { data } = await memberAPI.update(id, memberData);
      updateMember(id, data.data);
      return data.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeMember = async (id) => {
    setLoading(true);
    try {
      await memberAPI.delete(id);
      deleteMember(id);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getMemberById = useCallback((id) => {
    return members.find(m => m._id === id);
  }, [members]);

  return {
    members,
    loading,
    error,
    fetchMembers,
    createMember,
    editMember,
    removeMember,
    getMemberById,
  };
};