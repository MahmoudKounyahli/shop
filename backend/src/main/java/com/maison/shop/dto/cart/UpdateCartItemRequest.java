package com.maison.shop.dto.cart;

import jakarta.validation.constraints.Min;

public record UpdateCartItemRequest(@Min(1) Integer quantity) {}
