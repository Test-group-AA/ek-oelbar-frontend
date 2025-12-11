// src/app/services/order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, OrderLine, CreateOrderRequest, AddBeerRequest, OrderStatus } from '../models/order.model';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/api/orders`;

  constructor(private http: HttpClient) {}

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  getOrdersByStatus(status: OrderStatus): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/status/${status}`);
  }

  getOrderLines(orderId: number): Observable<OrderLine[]> {
    return this.http.get<OrderLine[]>(`${this.apiUrl}/${orderId}/lines`);
  }

  createOrder(request: CreateOrderRequest): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, request);
  }

  addBeerToOrder(orderId: number, request: AddBeerRequest): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/${orderId}/items`, request);
  }

  confirmOrder(id: number): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${id}/confirm`, {});
  }

  payOrder(id: number): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${id}/pay`, {});
  }

  completeOrder(id: number): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${id}/complete`, {});
  }

  cancelOrder(id: number): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${id}/cancel`, {});
  }
}