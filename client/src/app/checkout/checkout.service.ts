import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IDeliveryMethod } from '../shared/models/deliveryMethod';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService
{
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  getDeliveryMethods()
  {
    return this.http.get(this.baseUrl + 'order/deliveryMethods').pipe(
      map((deliveryMethods: IDeliveryMethod []) =>
      {
        return deliveryMethods.sort((a,b) => b.price - a.price);
      })
    );
  }
}
