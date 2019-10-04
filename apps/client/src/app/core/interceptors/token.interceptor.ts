import {
  HttpHandler,
  HttpHeaderResponse,
  HttpInterceptor,
  HttpProgressEvent,
  HttpRequest,
  HttpResponse,
  HttpSentEvent,
  HttpUserEvent
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { startWith, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  tokenType = '';

  constructor(private auth: AuthService, private router: Router) {}
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
    // when request to authorize endpoint, this will handle when auth fail
    // then retur to login page
    const shouldHandleAuthFail = !req.headers.get('NotHandleAuthFail');
    let request = req.clone({
      headers: req.headers.delete('NotHandleAuthFail')
    });
    request = req.clone({
      setHeaders: {
        Authorization: `${this.tokenType} ${this.auth.accessToken}`
      }
    });

    return next.handle(request).pipe(
      catchError(e => {
        if (shouldHandleAuthFail) {
          this.auth.logout();
          const returnUrl = this.router.url || '';
          this.router.navigate(['/login'], {
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
