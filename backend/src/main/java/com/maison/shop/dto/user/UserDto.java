package com.maison.shop.dto.user;

import java.time.LocalDate;
import java.util.List;

public record UserDto(
    String id,
    String firstName,
    String lastName,
    String email,
    LocalDate registrationDate,
    List<AddressDto> addresses
) {}
