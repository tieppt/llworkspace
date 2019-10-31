import { HttpHandler, HttpHeaderResponse, HttpInterceptor, HttpProgressEvent, HttpRequest, HttpResponse, HttpSentEvent, HttpUserEvent } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from '../../auth/services/auth.service';
import { HTTPStatusCode } from '../models/http-status-code';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<
    | HttpSentEvent
    | HttpHeaderResponse
    | HttpProgressEvent
    | HttpResponse<any>
    | HttpUserEvent<any>
  > {
    let request = req;
    // when request to authorize endpoint, this will handle when auth fail
    // then return to login page
    const notHandleAuthFail = request.headers.get('NotHandleAuthFail');
    if (notHandleAuthFail) {
      request = request.clone({
        headers: request.headers.delete('NotHandleAuthFail')
      });
    }
    const notAttachToken = request.headers.get('NotAttachToken');
    const auth = this.injector.get(AuthService);
    const router = this.injector.get(Router);
    if (notAttachToken) {
      request = request.clone({
        headers: request.headers.delete('NotAttachToken')
      });
    } else if (auth) {
      request = request.clone({
        setHeaders: {
          Authorization: auth.accessToken
        }
      });
    }

    return next.handle(request).pipe(
      tap(response => {
        if (response instanceof HttpResponse) {
          // server renew token on every request
          const token = response.headers.get('x-token');
          if (token && auth) {
            auth.storeCredentials(token);
          }
        }
      }),
      catchError(e => {
        if (e.status === HTTPStatusCode.UnAuthorized && !notHandleAuthFail) {
          auth.logout();
          const returnUrl = router.url || '';
          router.navigate(['/login'], {
            queryParams: {
              returnUrl
            }
          });
        }
        throw e;
      })
    );
  }
}
