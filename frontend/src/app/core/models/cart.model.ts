import { Product, ProductVariant } from './product.model';

export interface CartItem {
  variantId: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
}
