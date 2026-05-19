package com.maison.shop.dto.product;

import java.math.BigDecimal;

public record ProductVariantDto(
    Long id,
    Long productId,
    String sku,
    String color,
    String colorHex,
    String size,
    BigDecimal price,
    Integer stock
) {}
