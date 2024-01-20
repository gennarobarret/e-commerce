// auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoginCredentials } from 'src/app/core/models';
import { GLOBAL } from '../config/GLOBAL';
import { Observable, throwError, Subject, EMPTY } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { ApiResponse } from '../models/api-response.interface';
import { User, UserWithToken } from '../models/user.interface';
import { ForgotPasswordRequest } from '../models/forgot-password-request.interface';
@Injectable({
  providedIn: 'root',
})


export class AuthService {
  private url: string = GLOBAL.url;
  private loginSuccessSubject = new Subject<boolean>();
  public loginSuccessObservable = this.loginSuccessSubject.asObservable();

  constructor(private _http: HttpClient, private _router: Router) { }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(allowRoles: string[]): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(token);
      if (!decodedToken || !decodedToken['role']) {
        this.logout();
        return false;
      }
      return allowRoles.includes(decodedToken['role']);
    } catch (error) {
      this.logout();
      return false;
    }
  }

  loginUser(credentials: LoginCredentials): Observable<ApiResponse<UserWithToken>> {
    return this._http
      .post<ApiResponse<UserWithToken>>(`${this.url}loginUser`, credentials)
      .pipe(
        tap(response => {
          if (response.data && response.data.token) {
            this.storeToken(response.data.token);
            this._router.navigate(['/']);
            this.loginSuccessSubject.next(true);
          }
        }),
        catchError(error => this.handleError(error))
      );
  }

  // forgotPassword(request: ForgotPasswordRequest): Observable<ApiResponse<any>> {
  //   // ... tu lógica aquí
  // }


  logout(): void {
    this.removeToken();
    this._router.navigate(['/auth/login']);
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = error.error.message || 'An error occurred';
    return throwError(() => new Error(errorMessage));
  }

  private storeToken(token: string): void {
    localStorage.setItem('token', token);
  }

  private removeToken(): void {
    localStorage.removeItem('token');
  }

}
