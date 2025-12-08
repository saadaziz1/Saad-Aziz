import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_API_URL;

// Create an axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// --------- Auth ---------
export const registerUser = async (data) => {
  try {
    const res = await api.post("/users/register", data);
    return res.data;
  } catch (err) {
    console.error(err);
    return { success: false, message: err.response?.data?.message || "Network error" };
  }
};

export const loginUser = async (data) => {
  try {
    const res = await api.post("/users/login", data);
    return res.data;
  } catch (err) {
    console.error(err);
    return { success: false, message: err.response?.data?.message || "Network error" };
  }
};

// --------- Tasks ---------
export const fetchTasks = async (token) => {
  try {
    const res = await api.get("/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const createTask = async (task, token) => {
  try {
    const res = await api.post("/tasks", task, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error(err);
    return {};
  }
};

export const updateTask = async (id, task, token) => {
  try {
    const res = await api.put(`/tasks/${id}`, task, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error(err);
    return {};
  }
};

export const deleteTask = async (id, token) => {
  try {
    const res = await api.delete(`/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error(err);
    return {};
  }
};
