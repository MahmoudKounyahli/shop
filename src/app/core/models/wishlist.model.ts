import { Product } from './product.model';

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  product?: Product;
}
