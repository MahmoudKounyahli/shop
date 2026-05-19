package com.maison.shop.controller;

import com.maison.shop.dto.cart.AddToCartRequest;
import com.maison.shop.dto.cart.CartItemDto;
import com.maison.shop.dto.cart.UpdateCartItemRequest;
import com.maison.shop.service.CartService;
import com.maison.shop.service.UserSyncService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;
    private final UserSyncService userSyncService;

    public CartController(CartService cartService, UserSyncService userSyncService) {
        this.cartService = cartService;
        this.userSyncService = userSyncService;
    }

    @GetMapping
    public List<CartItemDto> getCart(@AuthenticationPrincipal Jwt jwt) {
        return cartService.getCart(UUID.fromString(jwt.getSubject()));
    }

    @PostMapping("/items")
    @ResponseStatus(HttpStatus.CREATED)
    public CartItemDto addItem(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody AddToCartRequest req) {
        return cartService.addItem(userSyncService.getUser(jwt), req);
    }

    @PutMapping("/items/{variantId}")
    public CartItemDto updateItem(@AuthenticationPrincipal Jwt jwt, @PathVariable Long variantId, @Valid @RequestBody UpdateCartItemRequest req) {
        return cartService.updateItem(UUID.fromString(jwt.getSubject()), variantId, req);
    }

    @DeleteMapping("/items/{variantId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeItem(@AuthenticationPrincipal Jwt jwt, @PathVariable Long variantId) {
        cartService.removeItem(UUID.fromString(jwt.getSubject()), variantId);
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void clearCart(@AuthenticationPrincipal Jwt jwt) {
        cartService.clearCart(UUID.fromString(jwt.getSubject()));
    }
}
