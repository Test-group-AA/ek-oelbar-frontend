import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { BeerService } from '../../services/beer.service';
import { CartService } from '../../services/cart.service';
import { ValidationService } from '../../services/validation.service';
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
  
  customerAge: number | null = null;
  hasStudentCard: boolean = false;
  selectedBeerId: number | null = null;
  quantity: number = 1;
  
  isLoading = false;
  error: string | null = null;
  success: string | null = null;
  
  ageError: string | null = null;

  constructor(
    private orderService: OrderService,
    private beerService: BeerService,
    public cartService: CartService,
    private validationService: ValidationService
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

  validateAge(): boolean {
    const result = this.validationService.isValidAge(this.customerAge);
    this.ageError = result.error || null;
    return result.valid;
  }

  createOrder(): void {
    this.error = null;
    this.ageError = null;
    
    if (!this.validateAge()) {
      this.error = this.ageError;
      return;
    }

    this.isLoading = true;

    this.orderService.createOrder({
      customerAge: this.customerAge!,
      hasStudentCard: this.hasStudentCard
    }).subscribe({
      next: (order) => {
        this.currentOrder = order;
        this.orderLines = [];
        this.success = 'Ordre oprettet!';
        this.isLoading = false;
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

    this.cartService.clearCart();
  }

  addBeer(): void {
    if (!this.currentOrder || !this.selectedBeerId) return;

    const qtyResult = this.validationService.isValidQuantity(this.quantity);
    if (!qtyResult.valid) {
      this.error = qtyResult.error || 'Ugyldigt antal';
      return;
    }

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