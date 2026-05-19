package com.maison.shop.controller;

import com.maison.shop.dto.order.OrderDto;
import com.maison.shop.dto.order.PlaceOrderRequest;
import com.maison.shop.service.OrderService;
import com.maison.shop.service.UserSyncService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final UserSyncService userSyncService;

    public OrderController(OrderService orderService, UserSyncService userSyncService) {
        this.orderService = orderService;
        this.userSyncService = userSyncService;
    }

    @GetMapping
    public List<OrderDto> getOrders(@AuthenticationPrincipal Jwt jwt) {
        return orderService.getOrders(UUID.fromString(jwt.getSubject()));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderDto placeOrder(@AuthenticationPrincipal Jwt jwt, @RequestBody PlaceOrderRequest req) {
        return orderService.placeOrder(userSyncService.getUser(jwt), req);
    }
}
