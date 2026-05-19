package com.maison.shop.seed;

import com.maison.shop.domain.product.*;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataSeeder implements ApplicationRunner {

    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public DataSeeder(BrandRepository brandRepository,
                      CategoryRepository categoryRepository,
                      ProductRepository productRepository) {
        this.brandRepository = brandRepository;
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (brandRepository.count() > 0) return;

        // Brands
        Brand maison = save(brand("Maison", null));
        Brand atelier = save(brand("Atelier", null));

        // Categories
        Category women = save(category("Women", "women", null));
        Category men = save(category("Men", "men", null));
        Category accessories = save(category("Accessories", "accessories", null));

        // Women products
        createProduct("Silk Wrap Dress", maison, women, "89.99", true,
            "A fluid silk wrap dress with elegant draping.",
            "100% Silk", "Dry clean only",
            new String[][]{{"Ivory", "#FFFFF0"}, {"Dusty Rose", "#DCAE96"}},
            new String[]{"XS", "S", "M", "L"}, 40,
            "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=800&fit=crop");

        createProduct("Linen Blazer", atelier, women, "149.99", true,
            "Tailored linen blazer with a relaxed silhouette.",
            "100% Linen", "Machine wash 30°C",
            new String[][]{{"Ecru", "#F5F0E8"}, {"Black", "#1A1A1A"}},
            new String[]{"XS", "S", "M", "L"}, 25,
            "https://images.unsplash.com/photo-1594938298603-c8148c4b4357?w=600&h=800&fit=crop");

        createProduct("Wide-Leg Trousers", maison, women, "119.99", false,
            "High-waisted wide-leg trousers in premium crepe.",
            "98% Polyester, 2% Elastane", "Machine wash cold",
            new String[][]{{"Camel", "#C19A6B"}, {"Navy", "#1F305E"}},
            new String[]{"XS", "S", "M", "L"}, 30,
            "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&h=800&fit=crop");

        createProduct("Merino Knit Sweater", atelier, women, "99.99", false,
            "Soft merino wool sweater with ribbed cuffs.",
            "100% Merino Wool", "Hand wash cold",
            new String[][]{{"Sage", "#9CAF88"}, {"Oatmeal", "#E3D9C6"}},
            new String[]{"XS", "S", "M", "L"}, 35,
            "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=800&fit=crop");

        createProduct("Cotton Midi Skirt", maison, women, "79.99", false,
            "A-line midi skirt in organic cotton.",
            "100% Organic Cotton", "Machine wash 30°C",
            new String[][]{{"White", "#FFFFFF"}, {"Terracotta", "#C06044"}},
            new String[]{"XS", "S", "M", "L"}, 45,
            "https://images.unsplash.com/photo-1583496661160-fb5218ees7e?w=600&h=800&fit=crop");

        // Men products
        createProduct("Oxford Button-Down", atelier, men, "89.99", true,
            "Classic Oxford shirt in premium cotton.",
            "100% Cotton Oxford", "Machine wash 40°C",
            new String[][]{{"White", "#FFFFFF"}, {"Light Blue", "#ADD8E6"}},
            new String[]{"S", "M", "L", "XL"}, 50,
            "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=800&fit=crop");

        createProduct("Slim Chinos", maison, men, "109.99", false,
            "Slim-fit chinos in stretch cotton.",
            "97% Cotton, 3% Elastane", "Machine wash 30°C",
            new String[][]{{"Khaki", "#C3B091"}, {"Olive", "#708238"}},
            new String[]{"S", "M", "L", "XL"}, 40,
            "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=800&fit=crop");

        createProduct("Wool Overcoat", atelier, men, "299.99", true,
            "Classic wool overcoat with notch lapel.",
            "80% Wool, 20% Polyester", "Dry clean only",
            new String[][]{{"Charcoal", "#36454F"}, {"Camel", "#C19A6B"}},
            new String[]{"S", "M", "L", "XL"}, 15,
            "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&h=800&fit=crop");

        createProduct("Merino Crewneck", maison, men, "119.99", false,
            "Slim-fit merino wool crewneck sweater.",
            "100% Merino Wool", "Hand wash cold",
            new String[][]{{"Navy", "#1F305E"}, {"Bordeaux", "#7C0A02"}},
            new String[]{"S", "M", "L", "XL"}, 30,
            "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=800&fit=crop");

        createProduct("Linen Shorts", atelier, men, "69.99", false,
            "Relaxed linen shorts for warm days.",
            "100% Linen", "Machine wash 30°C",
            new String[][]{{"Sand", "#C2B280"}, {"White", "#FFFFFF"}},
            new String[]{"S", "M", "L", "XL"}, 55,
            "https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=600&h=800&fit=crop");

        // Accessories
        createProduct("Leather Tote Bag", maison, accessories, "189.99", true,
            "Structured leather tote with interior pockets.",
            "100% Full-grain Leather", "Wipe clean with damp cloth",
            new String[][]{{"Black", "#1A1A1A"}, {"Tan", "#D2B48C"}},
            new String[]{"ONE SIZE", "ONE SIZE", "ONE SIZE", "ONE SIZE"}, 20,
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=800&fit=crop");

        createProduct("Silk Scarf", atelier, accessories, "59.99", false,
            "Printed silk twill scarf.",
            "100% Silk", "Dry clean only",
            new String[][]{{"Floral Print", "#E8D5B7"}, {"Geometric", "#C4B5A5"}},
            new String[]{"ONE SIZE", "ONE SIZE", "ONE SIZE", "ONE SIZE"}, 60,
            "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&h=800&fit=crop");

        createProduct("Leather Belt", maison, accessories, "79.99", false,
            "Classic leather belt with gold buckle.",
            "100% Genuine Leather", "Wipe clean",
            new String[][]{{"Black", "#1A1A1A"}, {"Brown", "#964B00"}},
            new String[]{"S", "M", "L", "XL"}, 40,
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop");

        createProduct("Cashmere Beanie", atelier, accessories, "49.99", true,
            "Soft cashmere ribbed beanie.",
            "100% Cashmere", "Hand wash cold",
            new String[][]{{"Camel", "#C19A6B"}, {"Charcoal", "#36454F"}},
            new String[]{"ONE SIZE", "ONE SIZE", "ONE SIZE", "ONE SIZE"}, 35,
            "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600&h=800&fit=crop");

        createProduct("Sunglasses", maison, accessories, "129.99", false,
            "Oversized acetate sunglasses with UV400 protection.",
            "Acetate frame, Polycarbonate lenses", "Store in case",
            new String[][]{{"Tortoise", "#8B4513"}, {"Black", "#1A1A1A"}},
            new String[]{"ONE SIZE", "ONE SIZE", "ONE SIZE", "ONE SIZE"}, 25,
            "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=800&fit=crop");
    }

    private void createProduct(String name, Brand brand, Category category,
                               String basePrice, boolean isNew, String description,
                               String material, String care,
                               String[][] colors, String[] sizes, int stock,
                               String imageUrl) {
        Product product = new Product();
        product.setName(name);
        product.setBrand(brand);
        product.setCategory(category);
        product.setDescription(description);
        product.setMaterialInfo(material);
        product.setCareInstructions(care);
        product.setIsNew(isNew);

        List<ProductVariant> variants = new ArrayList<>();
        int skuCounter = 0;
        for (String[] colorData : colors) {
            for (String size : sizes) {
                ProductVariant v = new ProductVariant();
                v.setProduct(product);
                v.setSku(name.substring(0, Math.min(3, name.length())).toUpperCase().replace(" ", "")
                    + "-" + colorData[0].substring(0, Math.min(3, colorData[0].length())).toUpperCase()
                    + "-" + size + "-" + (skuCounter++));
                v.setColor(colorData[0]);
                v.setColorHex(colorData[1]);
                v.setSize(size);
                v.setPrice(new BigDecimal(basePrice));
                v.setStock(stock);
                variants.add(v);
            }
        }
        product.setVariants(variants);

        List<ProductImage> images = new ArrayList<>();
        for (int i = 0; i < colors.length; i++) {
            ProductImage img = new ProductImage();
            img.setProduct(product);
            img.setImageUrl(imageUrl);
            img.setIsMain(i == 0);
            images.add(img);
        }
        product.setImages(images);

        productRepository.save(product);
    }

    private Brand save(Brand b) {
        return brandRepository.save(b);
    }

    private Category save(Category c) {
        return categoryRepository.save(c);
    }

    private Brand brand(String name, String logoUrl) {
        Brand b = new Brand();
        b.setName(name);
        b.setLogoUrl(logoUrl);
        return b;
    }

    private Category category(String name, String slug, Category parent) {
        Category c = new Category();
        c.setName(name);
        c.setSlug(slug);
        c.setParent(parent);
        return c;
    }
}
