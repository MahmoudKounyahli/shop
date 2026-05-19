package com.maison.shop.controller;

import com.maison.shop.dto.product.BrandDto;
import com.maison.shop.service.ProductService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/brands")
public class BrandController {

    private final ProductService productService;

    public BrandController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<BrandDto> getAll() {
        return productService.getAllBrands();
    }
}
