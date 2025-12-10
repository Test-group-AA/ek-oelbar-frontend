import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BeerService } from '../../services/beer.service';
import { Beer } from '../../models/beer.model';

@Component({
  selector: 'app-beer-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './beer-list.component.html',
  styleUrl: './beer-list.component.css'
})
export class BeerListComponent implements OnInit {
  tapBeers: Beer[] = [];
  bottledBeers: Beer[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private beerService: BeerService) {}

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
}