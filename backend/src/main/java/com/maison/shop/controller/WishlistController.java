package com.maison.shop.controller;

import com.maison.shop.dto.wishlist.AddToWishlistRequest;
import com.maison.shop.dto.wishlist.WishlistItemDto;
import com.maison.shop.service.UserSyncService;
import com.maison.shop.service.WishlistService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;
    private final UserSyncService userSyncService;

    public WishlistController(WishlistService wishlistService, UserSyncService userSyncService) {
        this.wishlistService = wishlistService;
        this.userSyncService = userSyncService;
    }

    @GetMapping
    public List<WishlistItemDto> getWishlist(@AuthenticationPrincipal Jwt jwt) {
        return wishlistService.getWishlist(UUID.fromString(jwt.getSubject()));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public WishlistItemDto addItem(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody AddToWishlistRequest req) {
        return wishlistService.addItem(userSyncService.getUser(jwt), req.productId());
    }

    @DeleteMapping("/{productId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeItem(@AuthenticationPrincipal Jwt jwt, @PathVariable Long productId) {
        wishlistService.removeItem(UUID.fromString(jwt.getSubject()), productId);
    }
}
