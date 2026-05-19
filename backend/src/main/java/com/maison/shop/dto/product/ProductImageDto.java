package com.maison.shop.dto.product;

public record ProductImageDto(
    Long id,
    Long productId,
    Long variantId,
    String imageUrl,
    boolean isMain
) {}
