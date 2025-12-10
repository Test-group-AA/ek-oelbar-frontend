// src/app/services/contact.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

export interface ContactMessage {
  id?: number;
  name: string;
  email: string;
  subject?: string;
  message: string;
  createdAt?: string;
  read?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  private apiUrl = `${environment.apiUrl}/api/contact`;

  constructor(private http: HttpClient) {}

  sendMessage(message: ContactMessage): Observable<ContactMessage> {
    return this.http.post<ContactMessage>(this.apiUrl, message);
  }

  getAllMessages(): Observable<ContactMessage[]> {
    return this.http.get<ContactMessage[]>(this.apiUrl);
  }

  getUnreadMessages(): Observable<ContactMessage[]> {
    return this.http.get<ContactMessage[]>(`${this.apiUrl}/unread`);
  }

  markAsRead(id: number): Observable<ContactMessage> {
    return this.http.put<ContactMessage>(`${this.apiUrl}/${id}/read`, {});
  }

  deleteMessage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}