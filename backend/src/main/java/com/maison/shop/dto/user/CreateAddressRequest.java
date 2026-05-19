package com.maison.shop.dto.user;

import com.maison.shop.domain.user.AddressType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateAddressRequest(
    @NotBlank String street,
    @NotBlank String houseNumber,
    @NotBlank String postalCode,
    @NotBlank String city,
    @NotBlank String country,
    @NotNull AddressType type
) {}
