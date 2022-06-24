import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IBasket, IBasketItem } from '../shared/models/basket';
import { BasketService } from './basket.service';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit
{
  basket$: Observable<IBasket>;

  constructor(private basketService: BasketService) { }

  ngOnInit(): void
  {
    this.basket$ = this.basketService.basketSource$;
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

}
