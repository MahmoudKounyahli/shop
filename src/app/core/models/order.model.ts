export type OrderStatus = 'received' | 'paid' | 'shipped' | 'delivered' | 'returned';

export interface OrderItem {
  id: string;
  orderId: string;
  variantId: string;
  quantity: number;
  priceAtPurchase: number;
}

export interface Order {
  id: string;
  userId: string;
  orderDate: string;
  totalAmount: number;
  status: OrderStatus;
  shippingAddressId: string;
  billingAddressId: string;
  items: OrderItem[];
}
