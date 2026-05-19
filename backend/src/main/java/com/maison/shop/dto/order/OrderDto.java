package com.maison.shop.dto.order;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderDto(
    Long id,
    LocalDateTime orderDate,
    BigDecimal totalAmount,
    String status,
    List<OrderItemDto> items,
    Long shippingAddressId,
    Long billingAddressId
) {}
