import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BASE_API_URL } from '@env/environment';
import { asyncScheduler, BehaviorSubject, Observable, of } from 'rxjs';
import { observeOn, switchMapTo, tap } from 'rxjs/operators';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isAuthenticated$ = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this._isAuthenticated$.asObservable();
  accessToken = '';

  constructor(private http: HttpClient, private router: Router) {
    const token = localStorage.getItem('accessToken');
    this.accessToken = token;
    if (token) {
      this._isAuthenticated$.next(true);
      // check if token still valid
      of(true)
        .pipe(
          observeOn(asyncScheduler),
          switchMapTo(
            this.http.get(`${BASE_API_URL}/user`, {
              headers: {
                NotHandleAuthFail: 'no'
              }
            })
          )
        )
        .subscribe({
          error: () => {
            this.logout();
            this.router.navigateByUrl('/login');
          }
        });
    }
  }

  login(loginReq: LoginRequest): Observable<object> {
    return this.http
      .post<LoginResponse>(`${BASE_API_URL}/login`, loginReq, {
        headers: {
          NotHandleAuthFail: 'no'
        }
      })
      .pipe(
        tap((res: LoginResponse) => {
          localStorage.setItem('accessToken', res.token);
          this.accessToken = res.token;
          this._isAuthenticated$.next(true);
        })
      );
  }

  logout() {
    this.accessToken = '';
    this._isAuthenticated$.next(false);
    localStorage.removeItem('accessToken');
  }
}
