// src/app/components/order/order.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { BeerService } from '../../services/beer.service';
import { Order, OrderLine, OrderStatus } from '../../models/order.model';
import { Beer } from '../../models/beer.model';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent implements OnInit {
  beers: Beer[] = [];
  currentOrder: Order | null = null;
  orderLines: OrderLine[] = [];
  
  customerAge: number = 18;
  hasStudentCard: boolean = false;
  selectedBeerId: number | null = null;
  quantity: number = 1;
  
  isLoading = false;
  error: string | null = null;
  success: string | null = null;

  constructor(
    private orderService: OrderService,
    private beerService: BeerService
  ) {}

  ngOnInit(): void {
    this.loadBeers();
  }

  loadBeers(): void {
    this.beerService.getAllBeers().subscribe({
      next: (beers) => this.beers = beers,
      error: () => this.error = 'Could not load beers'
    });
  }

  createOrder(): void {
    if (this.customerAge < 18) {
      this.error = 'You must be 18 or older to order';
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.orderService.createOrder({
      customerAge: this.customerAge,
      hasStudentCard: this.hasStudentCard
    }).subscribe({
      next: (order) => {
        this.currentOrder = order;
        this.orderLines = [];
        this.success = 'Order created!';
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.error || 'Could not create order';
        this.isLoading = false;
      }
    });
  }

  addBeer(): void {
    if (!this.currentOrder || !this.selectedBeerId) return;

    this.isLoading = true;
    this.orderService.addBeerToOrder(this.currentOrder.id!, {
      beerId: this.selectedBeerId,
      quantity: this.quantity
    }).subscribe({
      next: (order) => {
        this.currentOrder = order;
        this.loadOrderLines();
        this.success = 'Beer added!';
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.error || 'Could not add beer';
        this.isLoading = false;
      }
    });
  }

  loadOrderLines(): void {
    if (!this.currentOrder) return;
    this.orderService.getOrderLines(this.currentOrder.id!).subscribe({
      next: (lines) => this.orderLines = lines
    });
  }

  confirmOrder(): void {
    if (!this.currentOrder) return;
    this.updateOrderStatus('confirm');
  }

  payOrder(): void {
    if (!this.currentOrder) return;
    this.updateOrderStatus('pay');
  }

  completeOrder(): void {
    if (!this.currentOrder) return;
    this.updateOrderStatus('complete');
  }

  cancelOrder(): void {
    if (!this.currentOrder) return;
    this.updateOrderStatus('cancel');
  }

  private updateOrderStatus(action: string): void {
    this.isLoading = true;
    const method = action === 'confirm' ? this.orderService.confirmOrder(this.currentOrder!.id!) :
                   action === 'pay' ? this.orderService.payOrder(this.currentOrder!.id!) :
                   action === 'complete' ? this.orderService.completeOrder(this.currentOrder!.id!) :
                   this.orderService.cancelOrder(this.currentOrder!.id!);

    method.subscribe({
      next: (order) => {
        this.currentOrder = order;
        this.success = `Order ${action}ed!`;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.error || `Could not ${action} order`;
        this.isLoading = false;
      }
    });
  }

  getStatusClass(status: OrderStatus): string {
    const classes: { [key: string]: string } = {
      'CREATED': 'status-created',
      'CONFIRMED': 'status-confirmed',
      'PAID': 'status-paid',
      'COMPLETED': 'status-completed',
      'CANCELLED': 'status-cancelled'
    };
    return classes[status] || '';
  }

  canAddBeers(): boolean {
    return this.currentOrder?.status === OrderStatus.CREATED;
  }

  canConfirm(): boolean {
    return this.currentOrder?.status === OrderStatus.CREATED;
  }

  canPay(): boolean {
    return this.currentOrder?.status === OrderStatus.CONFIRMED;
  }

  canComplete(): boolean {
    return this.currentOrder?.status === OrderStatus.PAID;
  }

  canCancel(): boolean {
    return this.currentOrder?.status === OrderStatus.CREATED || 
           this.currentOrder?.status === OrderStatus.CONFIRMED;
  }
}