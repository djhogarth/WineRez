import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  getOrders()
  {
    return this.http.get(this.baseUrl + 'order');
  }

  getOrderDetails(id: number)
  {
    return this.http.get(this.baseUrl + 'order/' + id);
  }
}
