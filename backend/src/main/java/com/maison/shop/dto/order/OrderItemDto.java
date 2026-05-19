package com.maison.shop.dto.order;

import java.math.BigDecimal;

public record OrderItemDto(
    Long id,
    Long variantId,
    Integer quantity,
    BigDecimal priceAtPurchase
) {}
