package com.maison.shop.dto.user;

public record AddressDto(
    Long id,
    String street,
    String houseNumber,
    String postalCode,
    String city,
    String country,
    String type
) {}
