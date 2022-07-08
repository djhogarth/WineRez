import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket } from 'src/app/shared/models/basket';
import { IOrder, IOrderToCreate } from 'src/app/shared/models/order';
import { CheckoutService } from '../checkout.service';

declare var Stripe;

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent implements AfterViewInit, OnDestroy
{
  @Input() checkoutForm: FormGroup;
  // used for the template reference variables
  @ViewChild('cardNumber', {static: true}) cardNumberElement : ElementRef;
  @ViewChild('cardExpiry', {static: true}) cardExpiryElement : ElementRef;
  @ViewChild('cardCvc', {static: true}) cardCvcElement : ElementRef;
  // for accessing stripe javascript
  stripe: any;

  cardNumber: any;
  cardExpiry: any;
  cardCvc: any;
  cardErrors: any;

  constructor(private basketService: BasketService,
    private checkoutService: CheckoutService,
    private toastrService: ToastrService,
    private router: Router) { }

  ngOnDestroy()
  {
    this.cardNumber.destroy();
    this.cardExpiry.destroy();
    this.cardCvc.destroy();
  }

  ngAfterViewInit(): void
  {
    this.stripe = Stripe('pk_test_51LIiwUK3eJq4SJ8m0fLwNusaoms39GhYLEO6rKuOiJUuDbU65uEoh5nv1hw8BRXlsSCfMQCockdAGuVV2WcMldXh00NTDqqjmx');
    const elements = this.stripe.elements();

    this.cardNumber = elements.create('cardNumber');
    this.cardNumber.mount(this.cardNumberElement.nativeElement);

    this.cardExpiry = elements.create('cardExpiry');
    this.cardExpiry.mount(this.cardExpiryElement.nativeElement);

    this.cardCvc = elements.create('cardCvc');
    this.cardCvc.mount(this.cardCvcElement.nativeElement);
  }

  submitOrder()
  {
    const basket = this.basketService.getCurrentBasketValue();
    const orderToCreate = this.getOrderToCreate(basket);
    this.checkoutService.createOrder(orderToCreate).subscribe((order: IOrder) =>
    {
      this.toastrService.success('Order Created Successfully');
      this.basketService.deleteLocalBasket();
      const navigationExtras: NavigationExtras = {state: order};
      this.router.navigate(['checkout/success'], navigationExtras)
      console.log(order);
    }, error =>
    {
      this.toastrService.error(error.message);
      console.log(error);
    });
  }

  private getOrderToCreate(basket: IBasket) : IOrderToCreate
  {
    return {
      basketId: basket.id,
      deliveryMethodId: +this.checkoutForm.get('deliveryForm').get('deliveryMethod').value,
      shipToAddress: this.checkoutForm.get('addressForm').value
    };
  }

}
