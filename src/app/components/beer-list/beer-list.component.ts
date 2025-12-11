// src/app/components/beer-list/beer-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BeerService } from '../../services/beer.service';
import { CartService } from '../../services/cart.service';
import { Beer } from '../../models/beer.model';
import { BeerDetailModalComponent } from '../beer-detail-modal/beer-detail-modal.component';

@Component({
  selector: 'app-beer-list',
  standalone: true,
  imports: [CommonModule, BeerDetailModalComponent],
  templateUrl: './beer-list.component.html',
  styleUrl: './beer-list.component.css'
})
export class BeerListComponent implements OnInit {
  tapBeers: Beer[] = [];
  bottledBeers: Beer[] = [];
  isLoading = true;
  error: string | null = null;
  selectedBeer: Beer | null = null;

  constructor(
    private beerService: BeerService,
    public cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadBeers();
  }

  loadBeers(): void {
    this.isLoading = true;
    this.error = null;

    this.beerService.getTapBeers().subscribe({
      next: (beers) => {
        this.tapBeers = beers;
        this.checkLoadingComplete();
      },
      error: (err) => {
        this.error = 'Kunne ikke hente fadøl';
        this.isLoading = false;
        console.error('Error loading tap beers:', err);
      }
    });

    this.beerService.getBottledBeers().subscribe({
      next: (beers) => {
        this.bottledBeers = beers;
        this.checkLoadingComplete();
      },
      error: (err) => {
        this.error = 'Kunne ikke hente flaskeøl';
        this.isLoading = false;
        console.error('Error loading bottled beers:', err);
      }
    });
  }

  private checkLoadingComplete(): void {
    if (this.tapBeers.length > 0 || this.bottledBeers.length > 0) {
      this.isLoading = false;
    }
  }

  openBeerDetail(beer: Beer): void {
    this.selectedBeer = beer;
  }

  closeBeerDetail(): void {
    this.selectedBeer = null;
  }

  addToCart(beer: Beer, event: Event): void {
    event.stopPropagation(); // Prevent opening modal when clicking add button
    this.cartService.addToCart(beer, 1);
  }

  getQuantityInCart(beerId: number): number {
    return this.cartService.getQuantity(beerId);
  }
}