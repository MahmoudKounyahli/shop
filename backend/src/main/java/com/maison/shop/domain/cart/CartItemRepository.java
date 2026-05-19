package com.maison.shop.domain.cart;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    @Query("SELECT c FROM CartItem c JOIN FETCH c.variant v JOIN FETCH v.product p JOIN FETCH p.images WHERE c.user.id = :userId")
    List<CartItem> findByUserIdWithDetails(@Param("userId") UUID userId);

    Optional<CartItem> findByUserIdAndVariantId(UUID userId, Long variantId);

    void deleteByUserId(UUID userId);
}
