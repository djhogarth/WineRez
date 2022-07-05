import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IBasket, IBasketItem, IBasketTotals } from '../shared/models/basket';
import { BasketService } from './basket.service';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit
{
  basket$: Observable<IBasket>;
  basketTotal$: Observable<IBasketTotals>;

  constructor(private basketService: BasketService) { }

  ngOnInit(): void
  {
   this.getBasket();
   this.getBasketTotal();

  }

  //increment quantity of item in the shopping cart
  incrementItemQuantity(item: IBasketItem)
  {
    this.basketService.incrementItemQuantity(item);
  }

  //decrement quantity of item in the shopping cart
  decrementItemQuantity(item: IBasketItem)
  {
   this.basketService.decrementItemQuantity(item);
  }

  removeBasketItem(item: IBasketItem)
  {
    this.basketService.removeItemFromBasket(item);
  }

  getBasket()
  {
    this.basket$ = this.basketService.basketSource$;
  }

  getBasketTotal()
  {
    this.basketTotal$ = this.basketService.basketTotal$;
  }

}
