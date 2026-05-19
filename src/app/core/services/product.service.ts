import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Brand, Category, CategorySlug, Product, ProductImage, ProductVariant, Size } from '../models/product.model';
import { env } from '../config/env';

// ── Backend DTO shapes ────────────────────────────────────────────────────────

interface BrandDto { id: number; name: string; logoUrl?: string | null; }
interface CategoryDto { id: number; name: string; slug: string; parentCategoryId?: number | null; }
interface ProductVariantDto { id: number; productId: number; sku: string; color: string; colorHex: string; size: string; price: number; stock: number; }
interface ProductImageDto { id: number; productId: number; variantId?: number | null; imageUrl: string; isMain: boolean; }

interface ProductSummaryDto {
  id: number;
  name: string;
  brandName: string;
  categorySlug: string;
  mainImageUrl: string;
  minPrice: number;
  isNew: boolean;
  averageRating?: number | null;
  reviewCount?: number | null;
}

interface ProductDetailDto {
  id: number;
  name: string;
  brand: BrandDto;
  category: CategoryDto;
  description: string;
  materialInfo?: string | null;
  careInstructions?: string | null;
  isNew: boolean;
  variants: ProductVariantDto[];
  images: ProductImageDto[];
  averageRating?: number | null;
  reviewCount?: number | null;
}

interface Page<T> { content: T[]; }

// ── Mappers ───────────────────────────────────────────────────────────────────

function summaryToProduct(dto: ProductSummaryDto): Product {
  return {
    id: String(dto.id),
    brandId: dto.brandName.toLowerCase(),
    brand: { id: dto.brandName.toLowerCase(), name: dto.brandName },
    categoryId: dto.categorySlug,
    category: { id: dto.categorySlug, name: dto.categorySlug },
    name: dto.name,
    description: '',
    images: [{ id: `${dto.id}-img0`, productId: String(dto.id), imageUrl: dto.mainImageUrl, isMain: true }],
    variants: [{ id: `${dto.id}-v0`, productId: String(dto.id), sku: '', color: '', colorHex: '', size: 'M' as Size, price: dto.minPrice, stock: 0 }],
    isNew: dto.isNew,
    averageRating: dto.averageRating ?? undefined,
    reviewCount: dto.reviewCount ?? undefined,
  };
}

function detailToProduct(dto: ProductDetailDto): Product {
  return {
    id: String(dto.id),
    brandId: String(dto.brand.id),
    brand: { id: String(dto.brand.id), name: dto.brand.name, logoUrl: dto.brand.logoUrl ?? undefined },
    categoryId: dto.category.slug,
    category: {
      id: dto.category.slug,
      name: dto.category.name,
      parentCategoryId: dto.category.parentCategoryId ? String(dto.category.parentCategoryId) : undefined,
    },
    name: dto.name,
    description: dto.description,
    materialInfo: dto.materialInfo ?? undefined,
    careInstructions: dto.careInstructions ?? undefined,
    images: dto.images.map(img => ({
      id: String(img.id),
      productId: String(img.productId),
      variantId: img.variantId ? String(img.variantId) : undefined,
      imageUrl: img.imageUrl,
      isMain: img.isMain,
    })),
    variants: dto.variants.map(v => ({
      id: String(v.id),
      productId: String(v.productId),
      sku: v.sku,
      color: v.color,
      colorHex: v.colorHex,
      size: v.size as Size,
      price: Number(v.price),
      stock: v.stock,
    })),
    isNew: dto.isNew,
    averageRating: dto.averageRating ?? undefined,
    reviewCount: dto.reviewCount ?? undefined,
  };
}

// ── Service ───────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);

  getAll(): Observable<Product[]> {
    return this.http
      .get<Page<ProductSummaryDto>>(`${env.apiUrl}/products`)
      .pipe(map(page => page.content.map(summaryToProduct)));
  }

  getByCategory(categorySlug: CategorySlug | string): Observable<Product[]> {
    return this.http
      .get<Page<ProductSummaryDto>>(`${env.apiUrl}/products`, { params: { category: categorySlug } })
      .pipe(map(page => page.content.map(summaryToProduct)));
  }

  getById(id: string): Observable<Product | undefined> {
    return this.http
      .get<ProductDetailDto>(`${env.apiUrl}/products/${id}`)
      .pipe(map(dto => detailToProduct(dto)));
  }

  getFeatured(): Observable<Product[]> {
    return this.http
      .get<Page<ProductSummaryDto>>(`${env.apiUrl}/products`, { params: { category: 'women', size: '4' } })
      .pipe(map(page => page.content.filter(p => p.isNew).slice(0, 4).map(summaryToProduct)));
  }
}
