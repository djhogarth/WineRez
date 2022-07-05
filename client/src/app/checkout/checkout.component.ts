import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AccountService } from '../account/account.service';
import { BasketService } from '../basket/basket.service';
import { IBasketTotals } from '../shared/models/basket';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit
{
  checkoutForm: FormGroup;
  basketTotal$: Observable<IBasketTotals>;

  constructor(private formBuilder: FormBuilder,
    private accountService: AccountService,
    private basketService: BasketService) { }

  ngOnInit(): void
  {
    this.createCheckoutForm();
    this.setAddressFormValues();
    this.getBasketTotal();

  }

  // Fill in the address form with the address from their accounte
  setAddressFormValues()
  {
    this.accountService.getUserAddress().subscribe(address =>
      {
        if(address)
        {
          this.checkoutForm.get('addressForm').patchValue(address);
        }
      }, error =>
      {
        console.log(error);
      })
  }

  createCheckoutForm() {
    this.checkoutForm = this.formBuilder.group(
      {
        addressForm: this.formBuilder.group(
          {
            firstName: [null, Validators.required],
            lastName: [null, Validators.required],
            streetNumberAndName: [null, Validators.required],
            city: [null, Validators.required],
            country: [null, Validators.required],
            stateOrProvince: [null, Validators.required],
            zipCode: [null, Validators.required],
          }
        ),
        deliveryForm: this.formBuilder.group(
          {
            deliveryMethod: [null, Validators.required]
          }
        ),
        paymentForm: this.formBuilder.group(
          {
            nameOnCard: [null, Validators.required]
          }
        )
      }
    );
  }

  getBasketTotal()
  {
    this.basketTotal$ = this.basketService.basketTotal$;
  }

}
