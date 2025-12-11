// src/app/services/cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Beer } from '../models/beer.model';

export interface CartItem {
  beer: Beer;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly STORAGE_KEY = 'ek-oelbar-cart';
  private cartItems = new BehaviorSubject<CartItem[]>(this.loadFromStorage());
  
  // Observable streams
  public cartItems$ = this.cartItems.asObservable();
  
  constructor() {}

  getCartItems(): CartItem[] {
    return this.cartItems.value;
  }

  getCartCount(): number {
    return this.cartItems.value.reduce((count, item) => count + item.quantity, 0);
  }

  getCartTotal(): number {
    return this.cartItems.value.reduce(
      (total, item) => total + (item.beer.price * item.quantity), 
      0
    );
  }

  addToCart(beer: Beer, quantity: number = 1): void {
    const items = [...this.cartItems.value];
    const existingItem = items.find(item => item.beer.id === beer.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      items.push({ beer, quantity });
    }

    this.updateCart(items);
  }

  updateQuantity(beerId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(beerId);
      return;
    }

    const items = this.cartItems.value.map(item => 
      item.beer.id === beerId ? { ...item, quantity } : item
    );

    this.updateCart(items);
  }

  removeFromCart(beerId: number): void {
    const items = this.cartItems.value.filter(item => item.beer.id !== beerId);
    this.updateCart(items);
  }

  clearCart(): void {
    this.updateCart([]);
  }

  isInCart(beerId: number): boolean {
    return this.cartItems.value.some(item => item.beer.id === beerId);
  }

  getQuantity(beerId: number): number {
    const item = this.cartItems.value.find(item => item.beer.id === beerId);
    return item ? item.quantity : 0;
  }

  private updateCart(items: CartItem[]): void {
    this.cartItems.next(items);
    this.saveToStorage(items);
  }

  private saveToStorage(items: CartItem[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save cart to storage:', error);
    }
  }

  private loadFromStorage(): CartItem[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load cart from storage:', error);
      return [];
    }
  }
}