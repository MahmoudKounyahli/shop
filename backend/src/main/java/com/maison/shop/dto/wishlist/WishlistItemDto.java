package com.maison.shop.dto.wishlist;

import com.maison.shop.dto.product.ProductSummaryDto;

public record WishlistItemDto(Long id, ProductSummaryDto product) {}
