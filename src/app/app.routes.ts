// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { BeerListComponent } from './components/beer-list/beer-list.component';
import { EventsComponent } from './components/events/events.component';
import { ContactComponent } from './components/contact/contact.component';
import { OrderComponent } from './components/order/order.component';
import { ReservationComponent } from './components/reservation/reservation.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'beer', component: BeerListComponent },
  { path: 'events', component: EventsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'order', component: OrderComponent },
  { path: 'reservations', component: ReservationComponent },
  { path: '**', redirectTo: '' }
];