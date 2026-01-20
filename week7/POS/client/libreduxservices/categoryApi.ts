import { baseApi } from './api';

export interface Category {
    _id: string;
    name: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCategoryDto {
    name: string;
    isActive?: boolean;
}

export interface UpdateCategoryDto {
    name?: string;
    isActive?: boolean;
}

export const categoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query<Category[], void>({
            query: () => '/categories',
            providesTags: ['Category'],
        }),
        getAllCategories: builder.query<Category[], void>({
            query: () => '/categories/all',
            providesTags: ['Category'],
        }),
        createCategory: builder.mutation<Category, CreateCategoryDto>({
            query: (data) => ({
                url: '/categories',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Category'],
        }),
        updateCategory: builder.mutation<Category, { id: string; data: UpdateCategoryDto }>({
            query: ({ id, data }) => ({
                url: `/categories/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Category'],
        }),
        deleteCategory: builder.mutation<void, string>({
            query: (id) => ({
                url: `/categories/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Category'],
        }),
    }),
});

export const {
    useGetCategoriesQuery,
    useGetAllCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} = categoryApi;
