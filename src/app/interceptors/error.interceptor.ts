import {Injectable} from '@angular/core';
import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {environment} from '../../environments/environment';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // console.log('catch error called!!');
        // if ((error.status === 200 && error.url && error.url.includes('/cas/login')) || error.status === 401 || error.status === 403) {
        // if ((error.url && error.url.includes('cas')) || error.status === 302 || error.status === 403) {
        //   console.log('entered if!!!');
        //   window.location.href = environment.CAS_LOGIN_URL;
        this.router.navigate(['/']);
        // }
        return throwError(error);
      })
    );
  }
}

  // intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   return next.handle(req).pipe(event => {
  //       if (event instanceof HttpResponseBase) {
  //         console.log('if called!!');
  //         const response = event as HttpResponseBase;
  //         if (response && response.ok && response.url && response.url.toLowerCase().includes('cas')) {
  //           // Modify this portion appropriately to match your redirect page
  //           // const queryStringIndex = response.url.indexOf('?');
  //           // const loginUrl = queryStringIndex && queryStringIndex > 0 ? response.url.substring(0, queryStringIndex) : response.url;
  //           const loginUrl = environment.CAS_LOGIN_URL;
  //           console.log('User logout detected, redirecting to login page: %s', loginUrl);
  //           window.location.href = loginUrl;
  //         }
  //       }
  //     return event;
  //     });
  // }}
