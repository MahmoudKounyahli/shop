package com.maison.shop.domain.wishlist;

import com.maison.shop.domain.product.Product;
import com.maison.shop.domain.user.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "wishlist_items", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "product_id"}))
@Getter
@Setter
@NoArgsConstructor
public class WishlistItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;
}
