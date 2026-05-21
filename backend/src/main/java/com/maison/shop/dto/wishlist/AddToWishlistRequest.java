package com.maison.shop.dto.wishlist;

import jakarta.validation.constraints.NotNull;

public record AddToWishlistRequest(@NotNull Long productId) {}
