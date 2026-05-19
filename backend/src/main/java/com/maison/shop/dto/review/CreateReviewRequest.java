package com.maison.shop.dto.review;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateReviewRequest(
    @NotNull Long productId,
    @Min(1) @Max(5) Integer stars,
    @NotBlank String comment
) {}
