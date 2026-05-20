package com.maison.shop.service;

import com.maison.shop.domain.user.User;
import com.maison.shop.domain.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.UUID;

@Service
public class UserSyncService {

    private final UserRepository userRepository;

    public UserSyncService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public User syncUser(Jwt jwt) {
        UUID id = UUID.fromString(jwt.getSubject());
        return userRepository.findById(id).orElseGet(() -> {
            User user = new User();
            user.setId(id);
            user.setFirstName(jwt.getClaimAsString("given_name"));
            user.setLastName(jwt.getClaimAsString("family_name"));
            user.setEmail(jwt.getClaimAsString("email"));
            user.setRegistrationDate(LocalDate.now());
            return userRepository.save(user);
        });
    }

    @Transactional(readOnly = true)
    public User getUser(Jwt jwt) {
        return userRepository.findById(UUID.fromString(jwt.getSubject()))
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }
}
