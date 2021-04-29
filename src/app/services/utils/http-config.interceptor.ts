import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpResponse
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {Constants} from '../../constants';
import {NgxSpinnerService} from 'ngx-spinner';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {

  constructor(private spinner: NgxSpinnerService) {
  }

  /**
   * @description add necessary headers to request
   * @param request
   * @param next
   */
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.spinner.show();
    const token: string = localStorage.getItem(Constants.TOKEN_KEY);
    if (token) {
      request = request.clone({headers: request.headers.set('x-access-token', 'Bearer ' + token)});
    }

    if (!request.headers.has('Content-Type')) {
      request = request.clone({headers: request.headers.set('Content-Type', 'application/json')});
    }

    request = request.clone({headers: request.headers.set('Accept', 'application/json')});

    // console.log(request)

    return next.handle(request).pipe(
      map((event) => {
          if (event instanceof HttpResponse) {
            this.spinner.hide();
          }
          return event;
        })
      ,
      catchError((error: any) => {
        this.spinner.hide();
        return throwError(error);
      })

    );
  }
}
