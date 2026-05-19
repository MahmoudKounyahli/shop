package com.maison.shop.dto.review;

import java.time.LocalDateTime;

public record ReviewDto(
    Long id,
    String userId,
    Long productId,
    Integer stars,
    String comment,
    LocalDateTime createdAt,
    String userName
) {}
