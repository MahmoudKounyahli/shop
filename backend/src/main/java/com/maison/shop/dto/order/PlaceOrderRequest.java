package com.maison.shop.dto.order;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record PlaceOrderRequest(
    @NotNull @NotEmpty List<@Valid OrderLineItem> items,
    @NotNull Long shippingAddressId,
    @NotNull Long billingAddressId
) {
    public record OrderLineItem(@NotNull Long variantId, @Min(1) int quantity) {}
}
