package com.maison.shop.service;

import com.maison.shop.domain.product.*;
import com.maison.shop.domain.review.ReviewRepository;
import com.maison.shop.dto.product.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final ReviewRepository reviewRepository;

    public ProductService(ProductRepository productRepository,
                          CategoryRepository categoryRepository,
                          BrandRepository brandRepository,
                          ReviewRepository reviewRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.brandRepository = brandRepository;
        this.reviewRepository = reviewRepository;
    }

    public Page<ProductSummaryDto> getProducts(String categorySlug, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<Product> products = (categorySlug != null && !categorySlug.isBlank())
            ? productRepository.findByCategorySlug(categorySlug, pageRequest)
            : productRepository.findAll(pageRequest);
        return products.map(this::toSummaryDto);
    }

    public Optional<ProductDetailDto> getProductById(Long id) {
        return productRepository.findByIdWithDetails(id).map(this::toDetailDto);
    }

    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream().map(this::toCategoryDto).toList();
    }

    public List<BrandDto> getAllBrands() {
        return brandRepository.findAll().stream().map(this::toBrandDto).toList();
    }

    private ProductSummaryDto toSummaryDto(Product p) {
        String mainImageUrl = p.getImages().stream()
            .filter(img -> Boolean.TRUE.equals(img.getIsMain()))
            .findFirst()
            .map(img -> img.getImageUrl())
            .orElse(p.getImages().isEmpty() ? null : p.getImages().get(0).getImageUrl());

        double minPrice = p.getVariants().stream()
            .mapToDouble(v -> v.getPrice() != null ? v.getPrice().doubleValue() : 0)
            .min().orElse(0);

        Double avg = reviewRepository.getAverageRatingByProductId(p.getId());
        Long count = reviewRepository.getReviewCountByProductId(p.getId());

        return new ProductSummaryDto(
            p.getId(),
            p.getName(),
            p.getBrand() != null ? p.getBrand().getName() : null,
            p.getCategory() != null ? p.getCategory().getSlug() : null,
            mainImageUrl,
            minPrice,
            Boolean.TRUE.equals(p.getIsNew()),
            avg,
            count != null ? count : 0L
        );
    }

    private ProductDetailDto toDetailDto(Product p) {
        Double avg = reviewRepository.getAverageRatingByProductId(p.getId());
        Long count = reviewRepository.getReviewCountByProductId(p.getId());

        List<ProductVariantDto> variants = p.getVariants().stream()
            .map(v -> new ProductVariantDto(v.getId(), p.getId(), v.getSku(), v.getColor(), v.getColorHex(), v.getSize(), v.getPrice(), v.getStock()))
            .toList();

        List<ProductImageDto> images = p.getImages().stream()
            .map(img -> new ProductImageDto(img.getId(), p.getId(), img.getVariant() != null ? img.getVariant().getId() : null, img.getImageUrl(), Boolean.TRUE.equals(img.getIsMain())))
            .toList();

        return new ProductDetailDto(
            p.getId(),
            p.getName(),
            p.getBrand() != null ? new BrandDto(p.getBrand().getId(), p.getBrand().getName(), p.getBrand().getLogoUrl()) : null,
            p.getCategory() != null ? new CategoryDto(p.getCategory().getId(), p.getCategory().getName(), p.getCategory().getSlug(), p.getCategory().getParent() != null ? p.getCategory().getParent().getId() : null) : null,
            p.getDescription(),
            p.getMaterialInfo(),
            p.getCareInstructions(),
            Boolean.TRUE.equals(p.getIsNew()),
            variants,
            images,
            avg,
            count != null ? count : 0L
        );
    }

    private CategoryDto toCategoryDto(Category c) {
        return new CategoryDto(c.getId(), c.getName(), c.getSlug(), c.getParent() != null ? c.getParent().getId() : null);
    }

    private BrandDto toBrandDto(Brand b) {
        return new BrandDto(b.getId(), b.getName(), b.getLogoUrl());
    }
}
