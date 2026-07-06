import { Product } from 'libs/models/product.model';

export interface Category {
  id: number;
  name: string;
}

export interface CategoryDetail extends Category {
  products?: Product[];
}
