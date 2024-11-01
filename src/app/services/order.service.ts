import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Orders } from '../models/orders';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/products';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = 'http://localhost:3000/orders';
  private apiUrlProduct = 'http://localhost:3000/products';

  constructor(private http: HttpClient) {}

  getOrders(): Observable<Orders[]> {
    return this.http.get<Orders[]>(this.apiUrl);
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrlProduct);
}
  addOrder(order: Orders) : Observable<Orders> {
    return this.http.post<Orders>(this.apiUrl, order);
  }

  updateOrder(order: Orders) : Observable<Orders> {
    return this.http.put<Orders>(`${this.apiUrl}/${order.id}`, order);
  }

  deleteOrder(id: number) : Observable<Orders> {
    return this.http.delete<Orders>(`${this.apiUrl}/${id}`);
  }

  getOrderByMail(email: string) : Observable<Orders[]> {
    return this.http.get<Orders[]>(`${this.apiUrl}?email=${email}`);
  }
}
