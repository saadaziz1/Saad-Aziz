import { api } from '@/lib/api';
import { Car } from '@/types/api';

export interface CreateCarRequest {
  sellerId?: string;
  title: string;
  description?: string;
  make: string;
  model: string;
  year: number;
  bodyType: 'sedan' | 'sports' | 'hatchback' | 'convertible' | 'suv' | 'coupe';
  category?: string;
  photos?: string[];
  startingPrice: number;
  currentPrice?: number;
  startTime: string;
  endTime: string;
  // Additional form fields
  vin?: string;
  mileage?: number;
  engineSize?: '4' | '6' | '8' | '10' | '12';
  paint?: 'Original Paint' | 'Partially Repainted' | 'Totally Repainted';
  gccSpecs?: 'yes' | 'no';
  accidentHistory?: 'yes' | 'no';
  serviceHistory?: 'yes' | 'no';
  modified?: 'stock' | 'modified';
}

export const carsApi = {
  getAll: async (filters?: {
    make?: string;
    model?: string;
    year?: string;
    minPrice?: string;
    maxPrice?: string;
  }): Promise<Car[]> => {
    const params = new URLSearchParams();
    if (filters?.make) params.append('make', filters.make);
    if (filters?.model) params.append('model', filters.model);
    if (filters?.year) params.append('year', filters.year);
    if (filters?.minPrice) params.append('minPrice', filters.minPrice);
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice);
    
    const response = await api.get<Car[]>(`/cars?${params.toString()}`);
    return response.data;
  },

  getFilterOptions: async () => {
    const response = await api.get('/cars/filters/options');
    return response.data;
  },

  getById: async (id: string): Promise<Car> => {
    const response = await api.get<Car>(`/cars/${id}`);
    return response.data;
  },

  create: async (data: FormData): Promise<Car> => {
    const response = await api.post<Car>('/cars', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};