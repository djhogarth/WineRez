import { Component, OnInit } from '@angular/core';
import { IProduct } from '../shared/models/product';
import { IBrand } from '../shared/models/productBrand';
import { IType } from '../shared/models/productType';
import { ShopService } from './shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit
{
  products: IProduct[];
  brands: IBrand[];
  types: IType[];
  selectedTypeId = 0;
  selectedBrandId = 0;

  constructor(private shopService: ShopService) { }

  ngOnInit(): void
  {
    this.getBrands();
    this.getProducts();
    this.getTypes();
  }

  getProducts()
  {
    this.shopService.getProducts(this.selectedBrandId, this.selectedTypeId).subscribe(
      (response) =>
        {
          this.products = response.data;
        },
        error =>
        {
          console.log(error);
        }
    );
  }

  getTypes()
  {
    this.shopService.getTypes().subscribe(
      (response) =>
        {
          this.types = [{id: 0, name: 'All'}, ...response]
        },
        error =>
        {
          console.log(error);
        }
    );
  }

  getBrands()
  {
    this.shopService.getBrands().subscribe(
      (response) =>
        {
          this.brands = [{id: 0, name: 'All'}, ...response]
        },
        error =>
        {
          console.log(error);
        }
    );
  }

  OnBrandSelected(brandId: number)
  {
    this.selectedBrandId = brandId;
    this.getProducts();
  }

  OnTypeSelected(typeId: number)
  {
    this.selectedTypeId = typeId;
    this.getProducts();
  }

}
