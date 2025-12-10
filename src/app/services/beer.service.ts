import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Beer } from '../models/beer.model';
import { environment } from '../../../environment';

@Injectable({ providedIn: 'root' })
export class BeerService {
  private apiUrl = `${environment.apiUrl}/api/beers`;

  constructor(private http: HttpClient) {}

  getAllBeers(): Observable<Beer[]> {
    return this.http.get<Beer[]>(this.apiUrl);
  }

  getTapBeers(): Observable<Beer[]> {
    return this.http.get<Beer[]>(`${this.apiUrl}/tap`);
  }

  getBottledBeers(): Observable<Beer[]> {
    return this.http.get<Beer[]>(`${this.apiUrl}/bottled`);
  }

  getBeerById(id: number): Observable<Beer> {
    return this.http.get<Beer>(`${this.apiUrl}/${id}`);
  }

  searchBeers(query: string): Observable<Beer[]> {
    return this.http.get<Beer[]>(`${this.apiUrl}/search?q=${query}`);
  }

  createBeer(beer: Beer): Observable<Beer> {
    return this.http.post<Beer>(this.apiUrl, beer);
  }

  updateBeer(id: number, beer: Beer): Observable<Beer> {
    return this.http.put<Beer>(`${this.apiUrl}/${id}`, beer);
  }

  deleteBeer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
