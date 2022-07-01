import { Injectable } from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor
{

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
  {
    /*  fetch our token from local storage and if we have a token
        then we want it to automatically set the headers inside any
        requests that are going to the API. */
        
    const token = localStorage.getItem('token');

    if(token)
    {
      request = request.clone({
        setHeaders:
        {
          Authorization:`Bearer ${token}`
        }
      });
    }

    return next.handle(request);
  }
}
