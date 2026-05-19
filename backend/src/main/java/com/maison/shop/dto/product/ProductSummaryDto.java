package com.maison.shop.dto.product;

public record ProductSummaryDto(
    Long id,
    String name,
    String brandName,
    String categorySlug,
    String mainImageUrl,
    double minPrice,
    boolean isNew,
    Double averageRating,
    Long reviewCount
) {}
