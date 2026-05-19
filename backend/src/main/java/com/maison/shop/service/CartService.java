package com.maison.shop.service;

import com.maison.shop.domain.cart.CartItem;
import com.maison.shop.domain.cart.CartItemRepository;
import com.maison.shop.domain.product.ProductVariant;
import com.maison.shop.domain.product.ProductVariantRepository;
import com.maison.shop.domain.user.User;
import com.maison.shop.dto.cart.AddToCartRequest;
import com.maison.shop.dto.cart.CartItemDto;
import com.maison.shop.dto.cart.UpdateCartItemRequest;
import com.maison.shop.dto.product.ProductSummaryDto;
import com.maison.shop.dto.product.ProductVariantDto;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductVariantRepository variantRepository;

    public CartService(CartItemRepository cartItemRepository,
                       ProductVariantRepository variantRepository) {
        this.cartItemRepository = cartItemRepository;
        this.variantRepository = variantRepository;
    }

    @Transactional(readOnly = true)
    public List<CartItemDto> getCart(UUID userId) {
        return cartItemRepository.findByUserIdWithDetails(userId).stream()
            .map(this::toDto).toList();
    }

    public CartItemDto addItem(User user, AddToCartRequest req) {
        ProductVariant variant = variantRepository.findById(req.variantId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Variant not found"));

        if (variant.getStock() < req.quantity()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient stock");
        }

        CartItem item = cartItemRepository.findByUserIdAndVariantId(user.getId(), req.variantId())
            .orElseGet(() -> {
                CartItem newItem = new CartItem();
                newItem.setUser(user);
                newItem.setVariant(variant);
                newItem.setQuantity(0);
                newItem.setAddedAt(LocalDateTime.now());
                return newItem;
            });

        item.setQuantity(item.getQuantity() + req.quantity());
        return toDto(cartItemRepository.save(item));
    }

    public CartItemDto updateItem(UUID userId, Long variantId, UpdateCartItemRequest req) {
        CartItem item = cartItemRepository.findByUserIdAndVariantId(userId, variantId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart item not found"));
        item.setQuantity(req.quantity());
        return toDto(cartItemRepository.save(item));
    }

    public void removeItem(UUID userId, Long variantId) {
        CartItem item = cartItemRepository.findByUserIdAndVariantId(userId, variantId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart item not found"));
        cartItemRepository.delete(item);
    }

    public void clearCart(UUID userId) {
        cartItemRepository.deleteByUserId(userId);
    }

    private CartItemDto toDto(CartItem item) {
        var v = item.getVariant();
        var p = v.getProduct();
        String mainImg = p.getImages().stream()
            .filter(i -> Boolean.TRUE.equals(i.getIsMain()))
            .findFirst().map(i -> i.getImageUrl())
            .orElse(p.getImages().isEmpty() ? null : p.getImages().get(0).getImageUrl());

        var variantDto = new ProductVariantDto(v.getId(), p.getId(), v.getSku(), v.getColor(), v.getColorHex(), v.getSize(), v.getPrice(), v.getStock());
        var productDto = new ProductSummaryDto(p.getId(), p.getName(),
            p.getBrand() != null ? p.getBrand().getName() : null,
            p.getCategory() != null ? p.getCategory().getSlug() : null,
            mainImg, v.getPrice() != null ? v.getPrice().doubleValue() : 0,
            false, null, 0L);

        return new CartItemDto(item.getId(), variantDto, productDto, item.getQuantity(), item.getAddedAt());
    }
}
