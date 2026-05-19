package com.maison.shop.service;

import com.maison.shop.dto.auth.RegisterRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
public class KeycloakAdminService {

    @Value("${keycloak.admin.url}")
    private String keycloakUrl;

    @Value("${keycloak.admin.realm}")
    private String realm;

    @Value("${keycloak.admin.username}")
    private String adminUsername;

    @Value("${keycloak.admin.password}")
    private String adminPassword;

    private final RestClient restClient = RestClient.create();

    public String createUser(RegisterRequest req) {
        String adminToken = getAdminToken();

        Map<String, Object> userBody = Map.of(
            "email", req.email(),
            "username", req.email(),
            "firstName", req.firstName(),
            "lastName", req.lastName(),
            "enabled", true,
            "emailVerified", true,
            "credentials", List.of(Map.of(
                "type", "password",
                "value", req.password(),
                "temporary", false
            ))
        );

        ResponseEntity<Void> response = restClient.post()
            .uri(keycloakUrl + "/admin/realms/" + realm + "/users")
            .header("Authorization", "Bearer " + adminToken)
            .contentType(MediaType.APPLICATION_JSON)
            .body(userBody)
            .retrieve()
            .toBodilessEntity();

        String location = response.getHeaders().getFirst("Location");
        if (location == null) throw new RuntimeException("Keycloak did not return user location");
        return location.substring(location.lastIndexOf('/') + 1);
    }

    @SuppressWarnings("unchecked")
    private String getAdminToken() {
        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("grant_type", "password");
        form.add("client_id", "admin-cli");
        form.add("username", adminUsername);
        form.add("password", adminPassword);

        Map<String, Object> response = restClient.post()
            .uri(keycloakUrl + "/realms/master/protocol/openid-connect/token")
            .contentType(MediaType.APPLICATION_FORM_URLENCODED)
            .body(form)
            .retrieve()
            .body(Map.class);

        return (String) response.get("access_token");
    }
}
