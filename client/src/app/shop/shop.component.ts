import { Component, OnInit } from '@angular/core';
import { IProduct } from '../shared/models/product';
import { IBrand } from '../shared/models/productBrand';
import { IType } from '../shared/models/productType';
import { ShopParams } from '../shared/models/shopParams';
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
  shopParams = new ShopParams();
  totalCount: number;
  sortOptions =
  [
    {name: 'Alphabetical', value: 'name'},
    {name: 'Price: Low to High', value: 'priceAsc'},
    {name: 'Price: High to Low', value: 'priceDesc'},
  ];


  constructor(private shopService: ShopService) { }

  ngOnInit(): void
  {
    this.getBrands();
    this.getProducts();
    this.getTypes();
  }

  getProducts()
  {
    this.shopService.getProducts(this.shopParams).subscribe(
      (response) =>
        {
          this.products = response.data;
          this.shopParams.pageNumber = response.pageIndex;
          this.shopParams.pageSize = response.pageSize;
          this.totalCount = response.count;
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

  onBrandSelected(brandId: number)
  {
    this.shopParams.selectedBrandId = brandId;
    this.getProducts();
  }

  onTypeSelected(typeId: number)
  {
    this.shopParams.selectedTypeId = typeId;
    this.getProducts();
  }

  onSortSelected(sort: string)
  {
    this.shopParams.selectedSort = sort;
    this.getProducts();
  }

  onPageChanged(event: any)
  {
    this.shopParams.pageNumber = event;
    this.getProducts();
  }



}
