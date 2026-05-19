package com.maison.shop.service;

import com.maison.shop.domain.product.ProductRepository;
import com.maison.shop.domain.user.User;
import com.maison.shop.domain.wishlist.WishlistItem;
import com.maison.shop.domain.wishlist.WishlistRepository;
import com.maison.shop.dto.product.ProductSummaryDto;
import com.maison.shop.dto.wishlist.WishlistItemDto;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;

    public WishlistService(WishlistRepository wishlistRepository, ProductRepository productRepository) {
        this.wishlistRepository = wishlistRepository;
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public List<WishlistItemDto> getWishlist(UUID userId) {
        return wishlistRepository.findByUserIdWithProducts(userId).stream()
            .map(this::toDto).toList();
    }

    public WishlistItemDto addItem(User user, Long productId) {
        if (wishlistRepository.findByUserIdAndProductId(user.getId(), productId).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Already in wishlist");
        }
        var product = productRepository.findById(productId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
        WishlistItem item = new WishlistItem();
        item.setUser(user);
        item.setProduct(product);
        return toDto(wishlistRepository.save(item));
    }

    public void removeItem(UUID userId, Long productId) {
        wishlistRepository.deleteByUserIdAndProductId(userId, productId);
    }

    private WishlistItemDto toDto(WishlistItem w) {
        var p = w.getProduct();
        String mainImg = p.getImages().stream()
            .filter(i -> Boolean.TRUE.equals(i.getIsMain())).findFirst()
            .map(i -> i.getImageUrl())
            .orElse(p.getImages().isEmpty() ? null : p.getImages().get(0).getImageUrl());
        double minPrice = p.getVariants().stream()
            .mapToDouble(v -> v.getPrice() != null ? v.getPrice().doubleValue() : 0)
            .min().orElse(0);
        var productDto = new ProductSummaryDto(p.getId(), p.getName(),
            p.getBrand() != null ? p.getBrand().getName() : null,
            p.getCategory() != null ? p.getCategory().getSlug() : null,
            mainImg, minPrice, false, null, 0L);
        return new WishlistItemDto(w.getId(), productDto);
    }
}
