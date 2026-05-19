package com.maison.shop.dto.product;

import java.util.List;

public record ProductDetailDto(
    Long id,
    String name,
    BrandDto brand,
    CategoryDto category,
    String description,
    String materialInfo,
    String careInstructions,
    boolean isNew,
    List<ProductVariantDto> variants,
    List<ProductImageDto> images,
    Double averageRating,
    Long reviewCount
) {}
