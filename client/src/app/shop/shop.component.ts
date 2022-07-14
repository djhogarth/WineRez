import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('search', {static: false}) searchTerm: ElementRef;
  products: IProduct[];
  brands: IBrand[];
  types: IType[];
  shopParams : ShopParams;
  totalCount: number;
  sortOptions =
  [
    {name: 'Alphabetical', value: 'name'},
    {name: 'Price: Low to High', value: 'priceAsc'},
    {name: 'Price: High to Low', value: 'priceDesc'},
  ];


  constructor(private shopService: ShopService)
  {
    this.shopParams = this.shopService.getShopParams();
  }

  ngOnInit(): void
  {
    this.getBrands();
    this.getProducts(true);
    this.getTypes();
  }

  getProducts(useCache: boolean = false)
  {


    this.shopService.getProducts(useCache).subscribe(
      (response) =>
        {
          this.products = response.data;
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

  private applyFilterToPage(params: ShopParams)
  {
    this.shopService.setShopParams(params);
    this.getProducts();
  }

  onBrandSelected(brandId: number)
  {
    const params = this.shopService.getShopParams();
    params.selectedBrandId = brandId;
    params.pageNumber = 1;
    this.applyFilterToPage(params);
  }

  onTypeSelected(typeId: number)
  {
    const params = this.shopService.getShopParams();
    params.selectedTypeId = typeId;
    params.pageNumber = 1;
    this.applyFilterToPage(params);
  }

  onSortSelected(sort: string)
  {
    const params = this.shopService.getShopParams();
    params.selectedSort = sort;
    this.applyFilterToPage(params);
  }

  onPageChanged(event: any)
  {
    const params = this.shopService.getShopParams();
    if(params.pageNumber != event)
    {
      params.pageNumber = event;
      this.shopService.setShopParams(params);
      this.getProducts(true);
    }
  }


  onSearch()
  {
    const params = this.shopService.getShopParams();
    params.search = this.searchTerm.nativeElement.value;
    params.pageNumber = 1;
    this.applyFilterToPage(params);
  }

  onReset()
  {
    this.searchTerm.nativeElement.value = '';
    this.shopParams = new ShopParams();
    this.applyFilterToPage(this.shopParams);
  }

}
