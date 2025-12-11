// src/app/components/events/events.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';
import { QuickReservationComponent } from '../quick-reservation/quick-reservation.component';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, RouterLink, QuickReservationComponent],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent implements OnInit {
  events: Event[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.isLoading = true;
    this.error = null;

    this.eventService.getUpcomingEvents().subscribe({
      next: (events) => {
        this.events = events;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Kunne ikke hente events';
        this.isLoading = false;
        console.error('Error loading events:', err);
      }
    });
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('da-DK', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  }

  formatTime(timeStr: string): string {
    return timeStr.substring(0, 5);
  }

  onReservationSuccess(): void {
    // Reload events to update available spots
    this.loadEvents();
  }
}