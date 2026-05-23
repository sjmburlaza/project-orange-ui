import { Category } from 'src/app/core/models/category.model';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockStatus?: 'inStock' | 'lowStock' | 'outOfStock';
  stockQuantity: number;
  imageUrl: string;
  categoryId: number;
  categoryName?: string;
}

export interface ProductDetail extends Product {
  category?: Category;
}

export type ProductSort = 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

export interface ProductFilters {
  categoryId: number | null;
  sortBy: ProductSort | null;
  minPrice: number | null;
  maxPrice: number | null;
}
