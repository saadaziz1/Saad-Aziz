import axios from './axios';

const REVIEWS_BASE_URL = import.meta.env.VITE_API_REVIEWS_SERVICE || 'http://localhost:3001';

const reviewsApi = axios.create({
  baseURL: REVIEWS_BASE_URL,
});

// Add auth token to requests
reviewsApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const reviewsAPI = {
  // Get reviews for a product
  getProductReviews: (productId) => 
    reviewsApi.get(`/reviews/product/${productId}`),

  // Create a new review
  createReview: (data) => 
    reviewsApi.post('/reviews', data),

  // Reply to a review
  replyToReview: (reviewId, data) => 
    reviewsApi.post(`/reviews/${reviewId}/reply`, data),

  // Like a review
  likeReview: (reviewId) => 
    reviewsApi.post(`/reviews/${reviewId}/like`),
};