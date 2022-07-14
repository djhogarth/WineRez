import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IPagination, Pagination } from '../shared/models/pagination';
import { IProduct } from '../shared/models/product';
import { IBrand } from '../shared/models/productBrand';
import { IType } from '../shared/models/productType';
import { ShopParams } from '../shared/models/shopParams';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  baseUrl = environment.apiBaseUrl;
  products: IProduct[] = [];
  brands: IBrand[] = [];
  types: IType[] = [];
  pagination = new Pagination();
  shopParams = new ShopParams();
  productCache = new Map();

  constructor(private http: HttpClient) { }

  //get all products from the API so the template can display them
  getProducts(useCache: boolean)
  {
    if (useCache === false)
    {
      this.productCache = new Map();
    }

    // Get data from cache if there is an entry for a partiuclar set of shopping parameters
    if(this.productCache.size > 0 && useCache === true)
    {
      if(this.productCache.has(Object.values(this.shopParams).join('-')))
      {
        this.pagination.data = this.productCache.get(Object.values(this.shopParams).join('-'));
        return of(this.pagination);
      }
    }

    let params = new HttpParams();

    // Setting the filtering settings
    if(this.shopParams.selectedBrandId !== 0)
    {
      params = params.append('brandId', this.shopParams.selectedBrandId.toString());
    }

    if(this.shopParams.selectedTypeId !== 0)
    {
      params = params.append('typeId', this.shopParams.selectedTypeId.toString());
    }

    if(this.shopParams.search)
    {
      params = params.append('search', this.shopParams.search);
    }

    // setting the sort and pagination paramaters
    params = params.append('sortBy', this.shopParams.selectedSort);
    params = params.append('pageIndex', this.shopParams.pageNumber.toString());
    params = params.append('pageSize', this.shopParams.pageSize.toString());


    return this.http.get<IPagination>(this.baseUrl + 'products', {observe: 'response', params})
      .pipe(
        map(response => {
          this.productCache.set(Object.values(this.shopParams).join('-'), response.body.data)
          this.pagination = response.body;
          return this.pagination;
        })
      );
  }

  //get an individual product so the proudct details' template can display it
  getProduct(id: number)
  {
    let product: IProduct;
    this.productCache.forEach((products: IProduct[]) =>
    {
      product = products.find(p => p.id === id);
    });

    if(product)
    {
      return of(product);
    }
    return this.http.get<IProduct>(this.baseUrl + 'products/' + id);
  }

  getBrands()
  {
    if(this.brands.length > 0)
    {
      return of(this.brands);
    }

    return this.http.get<IBrand[]>(this.baseUrl + 'products/brands').pipe(
      map(response =>
        {
          this.brands = response;
          return response;
        })
    );;
  }

  getTypes()
  {
    if(this.types.length > 0)
    {
      return of(this.types);
    }
    return this.http.get<IType[]>(this.baseUrl + 'products/types').pipe(
      map(response =>
        {
          this.types = response;
          return response;
        })
    );
  }

  getShopParams() : ShopParams
  {
    return this.shopParams;
  }

  setShopParams(params: ShopParams)
  {
    this.shopParams = params;
  }

}
