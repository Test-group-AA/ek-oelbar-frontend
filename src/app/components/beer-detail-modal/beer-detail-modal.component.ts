// src/app/components/beer-detail-modal/beer-detail-modal.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Beer } from '../../models/beer.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-beer-detail-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './beer-detail-modal.component.html',
  styleUrl: './beer-detail-modal.component.css'
})
export class BeerDetailModalComponent {
  @Input() beer: Beer | null = null;
  @Output() close = new EventEmitter<void>();

  quantity = 1;
  showAddedFeedback = false;

  constructor(private cartService: CartService) {}

  onClose(): void {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  increaseQuantity(): void {
    if (this.quantity < 10) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (this.beer) {
      this.cartService.addToCart(this.beer, this.quantity);
      this.showAddedFeedback = true;
      
      setTimeout(() => {
        this.showAddedFeedback = false;
        this.quantity = 1;
      }, 2000);
    }
  }

  getQuantityInCart(): number {
    return this.beer ? this.cartService.getQuantity(this.beer.id!) : 0;
  }
}