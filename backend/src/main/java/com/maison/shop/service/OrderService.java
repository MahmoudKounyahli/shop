package com.maison.shop.service;

import com.maison.shop.domain.cart.CartItemRepository;
import com.maison.shop.domain.order.Order;
import com.maison.shop.domain.order.OrderItem;
import com.maison.shop.domain.order.OrderRepository;
import com.maison.shop.domain.order.OrderStatus;
import com.maison.shop.domain.product.ProductVariant;
import com.maison.shop.domain.product.ProductVariantRepository;
import com.maison.shop.domain.user.Address;
import com.maison.shop.domain.user.AddressRepository;
import com.maison.shop.domain.user.User;
import com.maison.shop.dto.order.OrderDto;
import com.maison.shop.dto.order.OrderItemDto;
import com.maison.shop.dto.order.PlaceOrderRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderService {

  private final OrderRepository orderRepository;
  private final ProductVariantRepository variantRepository;
  private final AddressRepository addressRepository;
  private final CartItemRepository cartItemRepository;

  public OrderService(OrderRepository orderRepository,
    ProductVariantRepository variantRepository,
    AddressRepository addressRepository,
    CartItemRepository cartItemRepository) {
    this.orderRepository = orderRepository;
    this.variantRepository = variantRepository;
    this.addressRepository = addressRepository;
    this.cartItemRepository = cartItemRepository;
  }

  @Transactional(readOnly = true)
  public List<OrderDto> getOrders(UUID userId) {
    return orderRepository.findByUserIdWithItems(userId).stream().map(this::toDto).toList();
  }

  public OrderDto placeOrder(User user, PlaceOrderRequest req) {
    var ids = List.of(req.shippingAddressId(), req.billingAddressId());
    Map<Long, Address> addressMap = addressRepository.findByIdInAndUserId(ids, user.getId())
      .stream().collect(Collectors.toMap(Address::getId, a -> a));

    if (!addressMap.containsKey(req.shippingAddressId()) || !addressMap.containsKey(req.billingAddressId())) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Address not found or does not belong to user");
    }

    var shippingAddress = addressMap.get(req.shippingAddressId());
    var billingAddress  = addressMap.get(req.billingAddressId());

    Order order = new Order();
    order.setUser(user);
    order.setOrderDate(LocalDateTime.now());
    order.setStatus(OrderStatus.RECEIVED);
    order.setShippingAddress(shippingAddress);
    order.setBillingAddress(billingAddress);

    List<OrderItem> items = new ArrayList<>();
    BigDecimal total = BigDecimal.ZERO;

    var variantIds = req.items().stream().map(PlaceOrderRequest.OrderLineItem::variantId).toList();
    Map<Long, ProductVariant> variantMap = variantRepository.findAllById(variantIds)
      .stream().collect(Collectors.toMap(ProductVariant::getId, v -> v));

    for (var lineItem : req.items()) {
      ProductVariant variant = variantMap.get(lineItem.variantId());
      if (variant == null) {
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Variant " + lineItem.variantId() + " not found");
      }
      if (variant.getStock() < lineItem.quantity()) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient stock for " + variant.getSku());
      }
      variant.setStock(variant.getStock() - lineItem.quantity());

      OrderItem item = new OrderItem();
      item.setOrder(order);
      item.setVariant(variant);
      item.setQuantity(lineItem.quantity());
      item.setPriceAtPurchase(variant.getPrice());
      items.add(item);
      total = total.add(variant.getPrice().multiply(BigDecimal.valueOf(lineItem.quantity())));
    }

    variantRepository.saveAll(variantMap.values());

    order.setItems(items);
    order.setTotalAmount(total);
    Order saved = orderRepository.save(order);

    cartItemRepository.deleteByUserId(user.getId());

    return toDto(saved);
  }

  private OrderDto toDto(Order o) {
    List<OrderItemDto> items = o.getItems().stream()
      .map(i -> new OrderItemDto(i.getId(), i.getVariant().getId(), i.getQuantity(), i.getPriceAtPurchase()))
      .toList();
    return new OrderDto(
      o.getId(),
      o.getOrderDate(),
      o.getTotalAmount(),
      o.getStatus().name().toLowerCase(),
      items,
      o.getShippingAddress() != null ? o.getShippingAddress().getId() : null,
      o.getBillingAddress() != null ? o.getBillingAddress().getId() : null
    );
  }
}
