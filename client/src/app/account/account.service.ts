import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import {IUser} from 'src/app/shared/models/user'

@Injectable({
  providedIn: 'root'
})
export class AccountService
{
  baseUrl = environment.apiBaseUrl;
  private currentUserSource = new BehaviorSubject<IUser>(null);
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
    return this.http.get(this.baseUrl + '/account/emailexists?email=' + email);
  }

  loadCurrentUser(token: string)
  {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http.get(this.baseUrl + 'account', {headers}).pipe(
      map((user: IUser) =>
      {
        localStorage.setItem('token', user.token);
        this.currentUserSource.next(user);
      })
    );
  }

  getCurrentUserValue()
  {
    return this.currentUserSource.value;
  }


}
