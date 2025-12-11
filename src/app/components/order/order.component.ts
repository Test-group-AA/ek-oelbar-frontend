// src/app/components/order/order.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { BeerService } from '../../services/beer.service';
import { CartService } from '../../services/cart.service';
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
    private beerService: BeerService,
    public cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadBeers();
    
    // Auto-create order if cart has items
    if (this.cartService.getCartCount() > 0 && !this.currentOrder) {
      // Show cart items preview
    }
  }

  loadBeers(): void {
    this.beerService.getAllBeers().subscribe({
      next: (beers) => this.beers = beers,
      error: () => this.error = 'Could not load beers'
    });
  }

  createOrder(): void {
    if (this.customerAge < 18) {
      this.error = 'Du skal være mindst 18 år for at bestille';
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
        this.success = 'Ordre oprettet!';
        this.isLoading = false;
        
        // Add cart items to order
        this.addCartItemsToOrder();
      },
      error: (err) => {
        this.error = err.error || 'Kunne ikke oprette ordre';
        this.isLoading = false;
      }
    });
  }

  addCartItemsToOrder(): void {
    const cartItems = this.cartService.getCartItems();
    
    if (cartItems.length === 0 || !this.currentOrder) {
      return;
    }

    // Add each cart item to the order
    cartItems.forEach(item => {
      this.orderService.addBeerToOrder(this.currentOrder!.id!, {
        beerId: item.beer.id!,
        quantity: item.quantity
      }).subscribe({
        next: (order) => {
          this.currentOrder = order;
          this.loadOrderLines();
        },
        error: (err) => {
          console.error('Error adding cart item:', err);
        }
      });
    });

    // Clear cart after adding to order
    this.cartService.clearCart();
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
        this.success = 'Øl tilføjet!';
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.error || 'Kunne ikke tilføje øl';
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
        this.success = `Ordre ${action}ed!`;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.error || `Kunne ikke ${action} ordre`;
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

  getCartCount(): number {
    return this.cartService.getCartCount();
  }

  getCartTotal(): number {
    return this.cartService.getCartTotal();
  }
}