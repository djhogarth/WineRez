import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket, IBasketItem } from '../../models/basket';
import { IOrder, IOrderItem } from '../../models/order';

@Component({
  selector: 'app-basket-summary',
  templateUrl: './basket-summary.component.html',
  styleUrls: ['./basket-summary.component.scss']
})
export class BasketSummaryComponent implements OnInit
{
  @Output() decrement: EventEmitter<IBasketItem> = new EventEmitter<IBasketItem>();
  @Output() increment: EventEmitter<IBasketItem> = new EventEmitter<IBasketItem>();
  @Output() remove: EventEmitter<IBasketItem> = new EventEmitter<IBasketItem>();
  @Input() isBasket = true;
  @Input() items: IOrderItem[] | IBasketItem[] | any;
  @Input() isOrder = false;

  constructor() {}

  ngOnInit(): void
  {

  }

  decrementItemQuantity(item: IBasketItem)
  {
    this.decrement.emit(item);
  }

  incrementItemQuantity(item: IBasketItem)
  {
    this.increment.emit(item);
  }

  removeBasketItem(item: IBasketItem)
  {
    this.remove.emit(item);
  }

}
