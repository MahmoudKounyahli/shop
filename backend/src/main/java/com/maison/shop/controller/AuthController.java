package com.maison.shop.controller;

import com.maison.shop.domain.user.User;
import com.maison.shop.domain.user.UserRepository;
import com.maison.shop.dto.auth.RegisterRequest;
import com.maison.shop.service.KeycloakAdminService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;

import java.time.LocalDate;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final KeycloakAdminService keycloakAdminService;
    private final UserRepository userRepository;

    public AuthController(KeycloakAdminService keycloakAdminService, UserRepository userRepository) {
        this.keycloakAdminService = keycloakAdminService;
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<Void> register(@Valid @RequestBody RegisterRequest req) {
        try {
            // 1. Create user in Keycloak → get UUID
            String keycloakId = keycloakAdminService.createUser(req);

            // 2. Immediately save to PostgreSQL
            User user = new User();
            user.setId(UUID.fromString(keycloakId));
            user.setFirstName(req.firstName());
            user.setLastName(req.lastName());
            user.setEmail(req.email());
            user.setRegistrationDate(LocalDate.now());
            userRepository.save(user);

            return ResponseEntity.status(HttpStatus.CREATED).build();

        } catch (HttpClientErrorException.Conflict e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
