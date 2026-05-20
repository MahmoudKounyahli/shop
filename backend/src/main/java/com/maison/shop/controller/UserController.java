package com.maison.shop.controller;

import com.maison.shop.domain.user.Address;
import com.maison.shop.domain.user.AddressRepository;
import com.maison.shop.domain.user.User;
import com.maison.shop.domain.user.UserRepository;
import com.maison.shop.dto.user.AddressDto;
import com.maison.shop.dto.user.CreateAddressRequest;
import com.maison.shop.dto.user.UpdateProfileRequest;
import com.maison.shop.dto.user.UserDto;
import com.maison.shop.service.UserSyncService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserSyncService userSyncService;
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public UserController(UserSyncService userSyncService, AddressRepository addressRepository, UserRepository userRepository) {
        this.userSyncService = userSyncService;
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public UserDto getMe(@AuthenticationPrincipal Jwt jwt) {
        User user = userSyncService.syncUser(jwt);
        return toUserDto(user, fetchAddresses(user));
    }

    @PutMapping("/me")
    public UserDto updateProfile(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody UpdateProfileRequest req) {
        User user = userSyncService.getUser(jwt);
        user.setFirstName(req.firstName());
        user.setLastName(req.lastName());
        userRepository.save(user);
        return toUserDto(user, fetchAddresses(user));
    }

    @GetMapping("/me/addresses")
    public List<AddressDto> getAddresses(@AuthenticationPrincipal Jwt jwt) {
        User user = userSyncService.getUser(jwt);
        return fetchAddresses(user);
    }

    @PostMapping("/me/addresses")
    @ResponseStatus(HttpStatus.CREATED)
    public AddressDto addAddress(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody CreateAddressRequest req) {
        User user = userSyncService.getUser(jwt);
        Address address = new Address();
        address.setUser(user);
        address.setStreet(req.street());
        address.setHouseNumber(req.houseNumber());
        address.setPostalCode(req.postalCode());
        address.setCity(req.city());
        address.setCountry(req.country());
        address.setType(req.type());
        return toAddressDto(addressRepository.save(address));
    }

    private List<AddressDto> fetchAddresses(User user) {
        return addressRepository.findByUserIdOrderById(user.getId()).stream()
            .map(this::toAddressDto)
            .toList();
    }

    private AddressDto toAddressDto(Address a) {
        return new AddressDto(
            a.getId(), a.getStreet(), a.getHouseNumber(), a.getPostalCode(),
            a.getCity(), a.getCountry(),
            a.getType() != null ? a.getType().name().toLowerCase() : null
        );
    }

    private UserDto toUserDto(User user, List<AddressDto> addresses) {
        return new UserDto(
            user.getId().toString(), user.getFirstName(), user.getLastName(),
            user.getEmail(), user.getRegistrationDate(), addresses
        );
    }
}
