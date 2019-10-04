import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_API_URL } from '@env/environment';
import { Observable } from 'rxjs';

export interface Contacts {
  type: 'email' | 'phone' | 'address';
  value: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  constructor(private http: HttpClient) {}

  getContacts(): Observable<Contacts[]> {
    return this.http.get<Contacts[]>(`${BASE_API_URL}/contacts`);
  }
}
