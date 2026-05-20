package com.maison.shop.domain.user;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "addresses")
@Getter
@Setter
@NoArgsConstructor
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String street;

    private String houseNumber;

    private String postalCode;

    private String city;

    private String country;

    @Enumerated(EnumType.STRING)
    private AddressType type;
}
