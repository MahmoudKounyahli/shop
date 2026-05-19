package com.maison.shop.controller;

import com.maison.shop.dto.review.CreateReviewRequest;
import com.maison.shop.dto.review.ReviewDto;
import com.maison.shop.service.ReviewService;
import com.maison.shop.service.UserSyncService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;
    private final UserSyncService userSyncService;

    public ReviewController(ReviewService reviewService, UserSyncService userSyncService) {
        this.reviewService = reviewService;
        this.userSyncService = userSyncService;
    }

    @GetMapping("/product/{productId}")
    public List<ReviewDto> getByProduct(@PathVariable Long productId) {
        return reviewService.getByProduct(productId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReviewDto createReview(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody CreateReviewRequest req) {
        return reviewService.createReview(userSyncService.getUser(jwt), req);
    }
}
