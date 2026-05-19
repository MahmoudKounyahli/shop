package com.maison.shop.dto.cart;

import com.maison.shop.dto.product.ProductSummaryDto;
import com.maison.shop.dto.product.ProductVariantDto;

import java.time.LocalDateTime;

public record CartItemDto(
    Long id,
    ProductVariantDto variant,
    ProductSummaryDto product,
    Integer quantity,
    LocalDateTime addedAt
) {}
