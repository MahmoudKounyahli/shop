package com.maison.shop.domain.wishlist;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface WishlistRepository extends JpaRepository<WishlistItem, Long> {

    @Query("SELECT w FROM WishlistItem w JOIN FETCH w.product p JOIN FETCH p.images WHERE w.user.id = :userId")
    List<WishlistItem> findByUserIdWithProducts(@Param("userId") UUID userId);

    Optional<WishlistItem> findByUserIdAndProductId(UUID userId, Long productId);

    void deleteByUserIdAndProductId(UUID userId, Long productId);
}
