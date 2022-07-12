import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { delay, finalize, Observable } from 'rxjs';
import { LoadingService } from '../services/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private loadingService: LoadingService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>>
  {
    //Don't show loading indicator for post requests for orders
    if(request.method === 'POST' && request.url.includes('order'))
    {
      // move on to the next request and skip this one
    }

    // don't display the page loader for email validation request
    if(request.url.includes('emailexists'))
    {
      return next.handle(request);
    }

    this.loadingService.loading();
    return next.handle(request).pipe(
      delay(1000),
      finalize(() => {
        this.loadingService.idle();
      })
    );
  }
}
