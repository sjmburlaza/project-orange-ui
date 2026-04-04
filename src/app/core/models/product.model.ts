import { Category } from 'src/app/core/models/category.model';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
  categoryId: number;
  categoryName?: string;
}

export interface ProductDetail extends Product {
  category?: Category;
}
