package com.maison.shop.service;

import com.maison.shop.domain.product.ProductRepository;
import com.maison.shop.domain.review.Review;
import com.maison.shop.domain.review.ReviewRepository;
import com.maison.shop.domain.user.User;
import com.maison.shop.dto.review.CreateReviewRequest;
import com.maison.shop.dto.review.ReviewDto;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;

    public ReviewService(ReviewRepository reviewRepository, ProductRepository productRepository) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public List<ReviewDto> getByProduct(Long productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId).stream()
            .map(this::toDto).toList();
    }

    public ReviewDto createReview(User user, CreateReviewRequest req) {
        if (reviewRepository.findByUserIdAndProductId(user.getId(), req.productId()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Already reviewed");
        }
        var product = productRepository.findById(req.productId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
        Review review = new Review();
        review.setUser(user);
        review.setProduct(product);
        review.setStars(req.stars());
        review.setComment(req.comment());
        review.setCreatedAt(LocalDateTime.now());
        return toDto(reviewRepository.save(review));
    }

    private ReviewDto toDto(Review r) {
        String name = r.getUser() != null ? r.getUser().getFirstName() : "Anonymous";
        return new ReviewDto(r.getId(), r.getUser().getId().toString(), r.getProduct().getId(), r.getStars(), r.getComment(), r.getCreatedAt(), name);
    }
}
