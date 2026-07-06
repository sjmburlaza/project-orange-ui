import { Product } from 'src/app/core/models/product.model';

export interface Category {
  id: number;
  name: string;
}

export interface CategoryDetail extends Category {
  products?: Product[];
}
