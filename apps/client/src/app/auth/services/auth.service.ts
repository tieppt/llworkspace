import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
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
      this.http.get(`${BASE_API_URL}/user`, {
        headers: {
          NotAttachToken: 'Y',
          NotHandleAuthFail: 'Y',
          Authorization: token
        }
      }).subscribe({
        error: (e) => {
          this.logout();
        }
      })
    }
  }

  login(loginReq: LoginRequest): Observable<object> {
    return this.http
      .post<LoginResponse>(`${BASE_API_URL}/login`, loginReq, {
        headers: {
          NotAttachToken: 'Y',
          NotHandleAuthFail: 'Y'
        }
      })
      .pipe(
        tap((res: LoginResponse) => {
          this.storeCredentials(res.token)
        })
      );
  }

  logout() {
    this.storeCredentials('', 'rm');
  }

  storeCredentials(token = '', addOrRemove: 'add' | 'rm' = 'add', emit = true) {
    this.accessToken = token;
    if (emit) {
      this._isAuthenticated$.next(!!token);
    }
    if (addOrRemove === 'add') {
      localStorage.setItem('accessToken', token);
    } else {
      localStorage.removeItem('accessToken');
    }
  }
}
