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
export class CheckoutPaymentComponent implements AfterViewInit, OnDestroy {
  @Input() checkoutForm: FormGroup;
  // used for the template reference variables
  @ViewChild('cardNumber', { static: true }) cardNumberElement: ElementRef;
  @ViewChild('cardExpiry', { static: true }) cardExpiryElement: ElementRef;
  @ViewChild('cardCvc', { static: true }) cardCvcElement: ElementRef;
  // for accessing stripe's javascript elements
  stripe: any;

  cardNumber: any;
  cardExpiry: any;
  cardCvc: any;
  cardErrors: any;
  cardHandler = this.onChange.bind(this);

  // local variables to hold validation state of stripe elements
  loadingState = false;
  cardNumberValid = false;
  cardExpiryValid = false;
  cardCvcValid = false;


  constructor(private basketService: BasketService,
    private checkoutService: CheckoutService,
    private toastrService: ToastrService,
    private router: Router) { }

  ngAfterViewInit(): void
  {
    this.stripe = Stripe('pk_test_51LIiwUK3eJq4SJ8m0fLwNusaoms39GhYLEO6rKuOiJUuDbU65uEoh5nv1hw8BRXlsSCfMQCockdAGuVV2WcMldXh00NTDqqjmx');
    const elements = this.stripe.elements();

    this.cardNumber = elements.create('cardNumber');
    this.cardNumber.mount(this.cardNumberElement.nativeElement);
    this.cardNumber.addEventListener('change', this.cardHandler);

    this.cardExpiry = elements.create('cardExpiry');
    this.cardExpiry.mount(this.cardExpiryElement.nativeElement);
    this.cardExpiry.addEventListener('change', this.cardHandler);


    this.cardCvc = elements.create('cardCvc');
    this.cardCvc.mount(this.cardCvcElement.nativeElement);
    this.cardCvc.addEventListener('change', this.cardHandler);

  }

  ngOnDestroy()
  {
    this.cardNumber.destroy();
    this.cardExpiry.destroy();
    this.cardCvc.destroy();
  }

  async submitOrder()
  {
    // synchronous code
    this.loadingState = true;
    const basket = this.basketService.getCurrentBasketValue();

    // asynchronous code

    try
    {
      const createOrder = await this.createOrder(basket);
      const paymentResult = await this.confirmPaymentWithStripe(basket);

      if (paymentResult.paymentIntent)
      {
        this.basketService.deleteBasket(basket);
        const navigationExtras: NavigationExtras = { state: createOrder };
        this.router.navigate(['checkout/success'], navigationExtras)
      } else {
        // display card payment errors from stripe
        this.toastrService.error(paymentResult.error.message)
      }
      // turn off loading indicators
      this.loadingState = false;
    } catch (error)
    {
      console.log(error);
      this.loadingState = false;
    }

  }

  /* Catch the stripe object which is an event that holds
    information about the stripe elements */
  onChange(event) {
    var stripeValidationError = event.error;
    if (stripeValidationError) {
      this.cardErrors = stripeValidationError.message;
    } else {
      this.cardErrors = null;
    }

    /* save the state of stripe validation flags
       for each stripe element in the form */
    switch (event.elementType)
    {
      case 'cardNumber':
        this.cardNumberValid = event.complete;
        break;
      case 'cardExpiry':
        this.cardExpiryValid = event.complete;
        break;
      case 'cardCvc':
        this.cardCvcValid = event.complete;
        break;
    }
  }

  private async createOrder(basket: IBasket)
  {
    const orderToCreate = this.getOrderToCreate(basket);
    return this.checkoutService.createOrder(orderToCreate).toPromise();
  }

  // mapping basket properties to order properties
  private getOrderToCreate(basket: IBasket): IOrderToCreate {
    return {
      basketId: basket.id,
      deliveryMethodId: +this.checkoutForm.get('deliveryForm').get('deliveryMethod').value,
      shipToAddress: this.checkoutForm.get('addressForm').value
    };
  }

  private confirmPaymentWithStripe(basket: IBasket)
  {
    return this.stripe.confirmCardPayment(basket.clientSecret,
      {
        payment_method:
        {
          card: this.cardNumber,
          billing_details:
          {
            name: this.checkoutForm.get('paymentForm').get('nameOnCard').value
          }
        }
      })
  }


}
