import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BasketService } from 'src/app/basket/basket.service';
import { IProduct } from 'src/app/shared/models/product';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ShopService } from '../shop.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product: IProduct;
  quantity = 1;

  constructor(private shopService: ShopService, private activatedRoute: ActivatedRoute,
    private breadCrumbService: BreadcrumbService, private basketService: BasketService)
    {
      this.breadCrumbService.set('@productDetails', ' ');
    }

  ngOnInit(): void
  {
    this.loadProduct();
  }

  loadProduct()
  {
    this.shopService.getProduct(+this.activatedRoute.snapshot.paramMap.get('id')).subscribe(returnedProduct =>
      {
        this.product = returnedProduct;
        this.breadCrumbService.set('@productDetails', returnedProduct.name)
      }, error =>
      {
        console.log(error);
      });
  }

  addItemToBasket()
  {
    this.basketService.addItemToBasket(this.product, this.quantity);
  }

  incrementQuantity()
  {
    this.quantity++;
  }

  decrementQuantity()
  {
    if(this.quantity > 1)
    this.quantity--;
  }

}
