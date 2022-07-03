import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, of, ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import {IUser} from 'src/app/shared/models/user'
import { IAddress } from '../shared/models/address';

@Injectable({
  providedIn: 'root'
})
export class AccountService
{
  baseUrl = environment.apiBaseUrl;
  private currentUserSource = new ReplaySubject<IUser>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  login(formInputs: any)
  {
    return this.http.post(this.baseUrl + 'account/login', formInputs).pipe(
      map((user: IUser) =>
      {
        if(user)
        {
          /* Persist the token so the user can be
           logged in again after closing the app */
           localStorage.setItem('token', user.token);
           this.currentUserSource.next(user);
        }
      })
    );
  }

  regiser(formInputs: any)
  {
    return this.http.post(this.baseUrl + 'account/register', formInputs).pipe(
      map((user: IUser) =>
      {
        if(user)
        {
          localStorage.setItem('token', user.token)
          this.currentUserSource.next(user);
        }
      })
    );
  }

  logOut()
  {
    localStorage.removeItem('token');
    this.currentUserSource.next(null);
    this.router.navigateByUrl('/');
  }

  checkEmailExists(email: string)
  {
    return this.http.get(this.baseUrl + 'account/emailexists?email=' + email);
  }

  loadCurrentUser(token: string)
  {
    //If user is not logged in, set the current user as null
    if(token === null)
    {
      this.currentUserSource.next(null);
      //return an observable with a null value
      return of(null);
    }

    return this.http.get(this.baseUrl + 'account').pipe(
      map((user: IUser) =>
      {
        localStorage.setItem('token', user.token);
        this.currentUserSource.next(user);
      })
    );
  }

  getUserAddress()
  {
    return this.http.get<IAddress>(this.baseUrl + 'account/address');
  }

  updateUserAddress( address: IAddress)
  {
    return this.http.post<IAddress>(this.baseUrl + 'account/address', address);
  }

}
