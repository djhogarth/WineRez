import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { IPagination } from '../shared/models/pagination';
import { IBrand } from '../shared/models/productBrand';
import { IType } from '../shared/models/productType';
import { ShopParams } from '../shared/models/shopParams';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  baseUrl = 'https://localhost:5001/api/'

  constructor(private http: HttpClient) { }

  getProducts(shopParams: ShopParams)
  {
    let params = new HttpParams();

    // Setting the filtering settings
    if(shopParams.selectedBrandId !== 0)
    {
      params = params.append('brandId', shopParams.selectedBrandId.toString());
    }

    if(shopParams.selectedTypeId !== 0)
    {
      params = params.append('typeId', shopParams.selectedTypeId.toString());
    }

    if(shopParams.search)
    {
      params = params.append('search', shopParams.search);
    }

    // setting the sort and pagination paramaters
    params = params.append('sortBy', shopParams.selectedSort);
    params = params.append('pageIndex', shopParams.pageNumber.toString());
    params = params.append('pageSize', shopParams.pageSize.toString());





    return this.http.get<IPagination>(this.baseUrl + 'products', {observe: 'response', params})
      .pipe(
        map(response => {
          return response.body;
        })
      );
  }

  getBrands()
  {
    return this.http.get<IBrand[]>(this.baseUrl + 'products/brands');
  }

  getTypes()
  {
    return this.http.get<IType[]>(this.baseUrl + 'products/types');
  }

}
