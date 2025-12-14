export const API_BASE_URL = 'http://localhost:5002/api';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    VERIFY: '/auth/verify'
  },
  PRODUCTS: {
    LIST: '/products',
    DETAIL: '/products/:id'
  },
  CART: {
    GET: '/cart',
    ADD: '/cart/add',
    UPDATE: '/cart/update',
    REMOVE: '/cart/remove'
  },
  ORDERS: {
    CREATE: '/orders',
    LIST: '/orders',
    DETAIL: '/orders/:id'
  }
};