import { Injectable } from '@angular/core';
import { from, Observable, of, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { BASE_API_URL } from '@env/environment';

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

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('accessToken');
    this.accessToken = token;
    if (token) {
      this._isAuthenticated$.next(true);
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
