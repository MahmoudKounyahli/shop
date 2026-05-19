package com.maison.shop.config;

import com.maison.shop.service.UserSyncService;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.stereotype.Component;

@Component
public class JwtClaimsConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    private final JwtGrantedAuthoritiesConverter authoritiesConverter;
    private final UserSyncService userSyncService;

    public JwtClaimsConverter(UserSyncService userSyncService) {
        this.authoritiesConverter = new JwtGrantedAuthoritiesConverter();
        this.userSyncService = userSyncService;
    }

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {
        userSyncService.syncUser(jwt);
        var authorities = authoritiesConverter.convert(jwt);
        return new JwtAuthenticationToken(jwt, authorities, jwt.getSubject());
    }
}
