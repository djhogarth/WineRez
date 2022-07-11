import { CdkStepper } from '@angular/cdk/stepper';
import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket } from 'src/app/shared/models/basket';

@Component({
  selector: 'app-checkout-review',
  templateUrl: './checkout-review.component.html',
  styleUrls: ['./checkout-review.component.scss']
})
export class CheckoutReviewComponent implements OnInit
{
  @Input() checkoutStepper: CdkStepper;
  basket$: Observable<IBasket>;

  constructor(private basketService: BasketService) { }

  ngOnInit(): void
  {
    this.getCustomerBasket();
  }

  getCustomerBasket()
  {
    this.basket$ = this.basketService.basketSource$;
  }

  createPaymentIntent()
  {
    return this.basketService.createPaymentIntent().subscribe((response: any) =>
    {
      console.log('Payment intent created!');
      this.checkoutStepper.next()
    }, error =>
    {
      console.log(error.message);
    });
  }
}
