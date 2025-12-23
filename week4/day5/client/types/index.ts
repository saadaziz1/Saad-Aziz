export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'SUPER_ADMIN';
}

export interface Movie {
  _id: string;
  title: string;
  description: string;
  genre: string;
  releaseYear: number;
  duration: number;
  thumbnailUrl: string;
  videoUrl: string;
  languages?: string[];
  director?: {
    name: string;
    image: string;
    country: string;
  };
  cast?: Array<{
    name: string;
    image: string;
  }>;
  reviews?: Array<{
    name: string;
    location: string;
    rating: number;
    review: string;
  }>;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}