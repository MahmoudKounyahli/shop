package com.maison.shop.dto.order;

import java.util.List;

public record PlaceOrderRequest(
    List<OrderLineItem> items,
    Long shippingAddressId,
    Long billingAddressId
) {
    public record OrderLineItem(Long variantId, int quantity) {}
}
