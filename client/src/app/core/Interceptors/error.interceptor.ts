import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router, private toast: ToastrService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
  {
    return next.handle(request).pipe(catchError( error =>
    {
      if(error)
      {
        // Handling the 400 Error by displaying a pop-up message using toastr service
        if(error.status === 400)
        {
          if(error.error.errors)
          {
            throw error.error;
          } else {
            this.toast.error(error.error.message, error.error.statusCode);
          }
        }

        // Handling the 401 Error by displaying a pop-up message using toastr service
        if(error.status === 401)
        {
          this.toast.error(error.error.message, error.error.statusCode)
        }

        // Handling the 404 Error by re-directing to the not found component
        if(error.status === 404)
        {
          this.router.navigateByUrl('/not-found');
        }

        // Handling the 500 Error by re-directing to the server error component
        if(error.status === 500)
        {
          const navigationExtras: NavigationExtras = {state: {exception: error.error}};
          this.router.navigateByUrl('/server-error', navigationExtras);
        }
      }
      return throwError(error);
    })
    );
  }
}
