const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        throw new Error('Unauthorized');
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Auth
  async register(data: { username: string; email: string; password: string; bio?: string }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: { email: string; password: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Users - current user profile (protected)
  async getProfile() {
    return this.request('/users/profile');
  }

  // Users - public profile by ID
  async getProfileById(userId: string) {
    return this.request(`/users/profile/${userId}`);
  }

  async getAllUsers() {
    return this.request('/users/all');
  }

  // Users (protected write)
  async updateProfile(data: { username?: string; email?: string; bio?: string; profilePicture?: string }) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async followUser(userId: string) {
    return this.request(`/users/follow/${userId}`, { method: 'POST' });
  }

  async unfollowUser(userId: string) {
    return this.request(`/users/follow/${userId}`, { method: 'DELETE' });
  }

  // Comments (public read)
  async getComments() {
    try {
      return this.request('/comments');
    } catch {
      return [];
    }
  }

  // Comments (protected write)
  async createComment(data: { content: string; parentComment?: string }) {
    return this.request('/comments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async likeComment(commentId: string) {
    return this.request(`/comments/${commentId}/like`, { method: 'POST' });
  }

  // Notifications (public read)
  async getNotifications() {
    try {
      return this.request('/notifications');
    } catch {
      return [];
    }
  }

  // Notifications (protected write)
  async markAsRead(notificationId: string) {
    return this.request(`/notifications/${notificationId}/read`, { method: 'PUT' });
  }

  async markAllAsRead() {
    return this.request('/notifications/mark-all-read', { method: 'PUT' });
  }
}

export const apiService = new ApiService();