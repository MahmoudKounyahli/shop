import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Order, OrderStatus } from '../models/order.model';
import { CartItem } from '../models/cart.model';
import { env } from '../config/env';

// ── Backend DTO shapes ────────────────────────────────────────────────────────

interface OrderItemDto { id: number; variantId: number; quantity: number; priceAtPurchase: number; }
interface OrderDto {
  id: number;
  orderDate: string;
  totalAmount: number;
  status: string;
  items: OrderItemDto[];
  shippingAddressId: number;
  billingAddressId: number;
}

// ── Mapper ────────────────────────────────────────────────────────────────────

function toOrder(dto: OrderDto): Order {
  return {
    id: String(dto.id),
    userId: '',
    orderDate: dto.orderDate,
    totalAmount: Number(dto.totalAmount),
    status: dto.status as OrderStatus,
    shippingAddressId: String(dto.shippingAddressId),
    billingAddressId: String(dto.billingAddressId),
    items: dto.items.map(i => ({
      id: String(i.id),
      orderId: String(dto.id),
      variantId: String(i.variantId),
      quantity: i.quantity,
      priceAtPurchase: Number(i.priceAtPurchase),
    })),
  };
}

// ── Service ───────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);

  getOrders(): Observable<Order[]> {
    return this.http.get<OrderDto[]>(`${env.apiUrl}/orders`).pipe(map(dtos => dtos.map(toOrder)));
  }

  placeOrder(
    cartItems: CartItem[],
    shippingAddressId: string,
    billingAddressId: string,
    _userId?: string,
  ): Observable<Order> {
    const body = {
      items: cartItems.map(i => ({ variantId: Number(i.variantId), quantity: i.quantity })),
      shippingAddressId: Number(shippingAddressId),
      billingAddressId: Number(billingAddressId),
    };
    return this.http.post<OrderDto>(`${env.apiUrl}/orders`, body).pipe(map(toOrder));
  }
}
