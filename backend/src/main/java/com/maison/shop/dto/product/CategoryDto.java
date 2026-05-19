package com.maison.shop.dto.product;

public record CategoryDto(Long id, String name, String slug, Long parentCategoryId) {}
