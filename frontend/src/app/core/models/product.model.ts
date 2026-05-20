export type CategorySlug = 'women' | 'men' | 'accessories';
export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL';

export interface Brand {
  id: string;
  name: string;
  logoUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  parentCategoryId?: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  color: string;
  colorHex: string;
  size: Size;
  price: number;
  stock: number;
}

export interface ProductImage {
  id: string;
  productId: string;
  variantId?: string;
  imageUrl: string;
  isMain: boolean;
}

export interface Product {
  id: string;
  brandId: string;
  brand?: Brand;
  categoryId: string;
  category?: Category;
  name: string;
  description: string;
  materialInfo?: string;
  careInstructions?: string;
  images: ProductImage[];
  variants: ProductVariant[];
  isNew?: boolean;
  averageRating?: number;
  reviewCount?: number;
}
