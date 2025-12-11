// src/app/models/order.model.ts
export interface Order {
  id?: number;
  customerAge: number;
  hasStudentCard: boolean;
  status: OrderStatus;
  totalPrice: number;
  discountPercent: number;
  finalPrice: number;
  createdAt?: string;
  updatedAt?: string;
}

export enum OrderStatus {
  CREATED = 'CREATED',
  CONFIRMED = 'CONFIRMED',
  PAID = 'PAID',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface OrderLine {
  id?: number;
  beer: { id: number; name: string; price: number };
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface CreateOrderRequest {
  customerAge: number;
  hasStudentCard: boolean;
}

export interface AddBeerRequest {
  beerId: number;
  quantity: number;
}