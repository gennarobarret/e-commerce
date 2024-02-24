// auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoginCredentials } from 'src/app/core/models';
import { GLOBAL } from '../config/GLOBAL';
import { Observable, throwError, Subject, EMPTY, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { ApiResponse } from '../models/api-response.interface';
import { User, UserWithToken } from '../models/user.interface';
import { ForgotPasswordRequest } from '../models/forgot-password.interface';
@Injectable({
  providedIn: 'root',
})

export class AuthService {
  private url: string = GLOBAL.url;
  private loginSuccessSubject = new Subject<boolean>();
  public loginSuccessObservable = this.loginSuccessSubject.asObservable();

  constructor(private _http: HttpClient, private _router: Router) { }


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
  forgotPassword(request: ForgotPasswordRequest): Observable<ApiResponse<any>> {
    // Asegúrate de que la URL es correcta y corresponde con tu backend
    return this._http.post<ApiResponse<any>>(`${this.url}forgotPassword`, request)
      .pipe(
        tap((response) => console.log('Forgot password response:', response)),
        catchError(this.handleError)
      );
  }


  createMasterAdmin(data: any): Observable<any> {
    return this._http.post(`${this.url}createMasterAdmin`, data);
  }

  activateAccount(token: string): Observable<any> {
    const url = `${this.url}/activation/${token}`;
    return this._http.get(url).pipe(
      catchError(error => {
        console.error('Error activating account:', error);
        return of(null);
      })
    );
  }

  resendVerificationEmail(emailAddress: string): Observable<any> {
    return this._http.post(`${this.url}/resendVerificationEmail`, { emailAddress })
      .pipe(
        catchError(error => {
          console.error('Error resending the verification email:', error);
          return of(null);
        })
      );
  }

  // En AuthService
  authenticateWithGoogle(token: string): Observable<any> {
    return this._http.post(`${this.url}auth/google`, { token }).pipe(
      tap((response: any) => {
        // Asumiendo que la respuesta del backend incluye el token en response.token
        this.storeToken(response.token); // Almacenar el token usando un método del servicio
        // Aquí puedes agregar cualquier otra lógica necesaria después de la autenticación exitosa
      }),
      catchError(error => this.handleError(error))
    );
  }

  logout(): void {
    this.removeToken();
    this._router.navigate(['/auth/login']);
  }

}
