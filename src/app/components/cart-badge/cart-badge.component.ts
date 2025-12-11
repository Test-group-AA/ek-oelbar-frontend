// src/app/components/cart-badge/cart-badge.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-badge',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart-badge.component.html',
  styleUrl: './cart-badge.component.css'
})
export class CartBadgeComponent implements OnInit {
  cartCount = 0;
  showPreview = false;

  constructor(public cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(() => {
      this.cartCount = this.cartService.getCartCount();
    });
  }

  togglePreview(): void {
    this.showPreview = !this.showPreview;
  }

  closePreview(): void {
    this.showPreview = false;
  }
}