import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Basket, IBasket, IBasketItem, IBasketTotals } from '../shared/models/basket';
import { IDeliveryMethod } from '../shared/models/deliveryMethod';
import { IProduct } from '../shared/models/product';

@Injectable({
  providedIn: 'root'
})
export class BasketService
{
  baseUrl = environment.apiBaseUrl;
  private basketSource = new BehaviorSubject<IBasket>(null);
  basketSource$ = this.basketSource.asObservable();
  private basketTotalSource = new BehaviorSubject<IBasketTotals>(null);
  basketTotal$ = this.basketTotalSource.asObservable();
  shippingPrice = 0;

  constructor(private http: HttpClient) { }

  getBasket(id: string)
  {
    return this.http.get(this.baseUrl + 'basket?basketId=' + id)
      .pipe(
        map((basket: IBasket) =>
        {
          this.basketSource.next(basket);
          this.shippingPrice = basket.shippingPrice;
          this.calculateBasketTotal();
        })
      );
  }

  setBasket(basket: IBasket)
  {
    return this.http.post(this.baseUrl + 'basket', basket).subscribe((response: IBasket) =>
    {
      this.basketSource.next(response);
      this.calculateBasketTotal();
    }, error => {
      console.log(error);
    });
  }

  getCurrentBasketValue()
  {
    return this.basketSource.value;
  }

  private calculateBasketTotal()
  {
    const basket = this.getCurrentBasketValue();
    const shippingCost = this.shippingPrice;

    /*The 'a' represents the cumulative amount of the product
      prices which is returned by the reduce function.
      It is set to start at a value of 0. The 'b' represnets
      each product item in the array. */
    const subtotal = basket.items.reduce((a,b) => (b.price * b.quantity) + a, 0);
    const total = subtotal + shippingCost;

    // create the IBaskeTotals object and store in  the observable
    this.basketTotalSource.next({shippingCost, total, subtotal});
  }

  setShippingPrice(deliveryMethod: IDeliveryMethod)
  {
    this.shippingPrice = deliveryMethod.price;
    const basket = this.getCurrentBasketValue();
    basket.deliveryMethodId = deliveryMethod.id;
    basket.shippingPrice = deliveryMethod.price;
    this.calculateBasketTotal();
    this.setBasket(basket);
  }

  addItemToBasket(item: IProduct, quantity: number)
  {
    const itemToAdd: IBasketItem = this.mapProductItemToBasketItem(item, quantity);
    const basket = this.getCurrentBasketValue() ?? this.createBasket();
    basket.items = this.addOrUpdateItem(basket.items, itemToAdd, quantity);
    this.setBasket(basket);
  }

  /*Delete the basket on the client-side
    and update the related observables */
  deleteLocalBasket()
  {
    this.basketSource.next(null);
    this.basketTotalSource.next(null);
    localStorage.removeItem('basket_id');
  }

  /* If the user adds an product to their cart that's already in their cart, increase the item quantity.
    If the user add a unique item to the cart, add a brand new item */
  addOrUpdateItem(items: IBasketItem[], itemToAdd: IBasketItem, quantity: number): IBasketItem[]
  {
   const index = items.findIndex(i => i.id === itemToAdd.id)
   if(index === -1)
   {
    itemToAdd.quantity = quantity;
    items.push(itemToAdd);
   } else {
    items[index].quantity += quantity;
   }
   return items;
  }

  //increment quantity of item in the shopping cart
  incrementItemQuantity(item: IBasketItem)
  {
    const basket = this.getCurrentBasketValue();
    const foundItemIndex = basket.items.findIndex(x => x.id == item.id);
    basket.items[foundItemIndex].quantity++;
    this.setBasket(basket);
  }

  //decrement quantity of item in the shopping cart
  decrementItemQuantity(item: IBasketItem)
  {
    const basket = this.getCurrentBasketValue();
    const foundItemIndex = basket.items.findIndex(x => x.id == item.id);

    /*If item quantity is greater than one, the decrement the quantity,
      if not then remove the item altogether */
    if(basket.items[foundItemIndex].quantity > 1)
    {
      basket.items[foundItemIndex].quantity--;
      this.setBasket(basket);
    } else {
      this.removeItemFromBasket(item);
    }
  }

  removeItemFromBasket(item: IBasketItem)
  {
    const basket = this.getCurrentBasketValue();

    if(basket.items.some(x => x.id === item.id))
    {
      /*filter method returns all items with ids that
        do not match selected item's id*/
      basket.items = basket.items.filter(i => i.id !== item.id);
      if(basket.items.length > 0)
      {
        this.setBasket(basket);
      } else {
        this.deleteBasket(basket);
      }
    }
  }

  // Delete the basket on the API
  deleteBasket(basket: IBasket)
  {
    return this.http.delete(this.baseUrl + 'basket?basketId=' + basket.id).subscribe(() =>
    {
      this.deleteLocalBasket();
    }, error => {
      console.log(error);
    });
  }


  private createBasket(): IBasket
  {
    const basket = new Basket();

    /*persisting the basket ID by storing
      the basket ID in broswer local storage to
      fetch the basket on app start up */
    localStorage.setItem('basket_id', basket.id)

    return basket;
  }

  createPaymentIntent()
  {
    return this.http.post(this.baseUrl + 'payments/' + this.getCurrentBasketValue().id, {})
      .pipe(
        map((basket: IBasket) =>
        {
          this.basketSource.next(basket);
        }
      )
    );
  }

  private mapProductItemToBasketItem(item: IProduct, quantity: number): IBasketItem
  {
    return {
      id: item.id,
      productName: item.name,
      price: item.price,
      pictureUrl: item.pictureUrl,
      quantity,
      brand: item.productBrand,
      type: item.productType
    };
  }
}
