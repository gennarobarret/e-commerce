import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoginCredentials } from 'src/app/core/models';
import { GLOBAL } from '../config/GLOBAL';
import { Observable, throwError, Subject, EMPTY } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

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

  login_admin(credentials: LoginCredentials): Observable<any> {
    return this._http
      .post<any>(`${this.url}login_admin`, credentials)
      .pipe(
        tap(response => {
          if (response.token) {
            this.storeToken(response.token);
            this._router.navigate(['/']);
            this.loginSuccessSubject.next(true);
          }
        }),
        catchError(error => this.handleError(error))
      );
  }


  logout(): void {
    this.removeToken();
    this._router.navigate(['/auth/login']);
  }

  get_admin(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      this._router.navigate(['/auth/login']);
      return EMPTY;
    }
    return this._http.get(`${this.url}get_admin`);
  }


  check_admin_exists(): Observable<any> {
    return this._http.get<any>(`${this.url}check_admin_exists`);
  }

  createAdmin(data: any): Observable<any> {
    return this._http.post(`${this.url}create_admin`, data);
  }

  update_admin(data: any): Observable<any> {
    if (data.profileImage) {
      const fd = new FormData();
      fd.append('_id', data._id);
      fd.append('userName', data.userName);
      fd.append('firstName', data.firstName);
      fd.append('lastName', data.lastName);
      fd.append('organizationName', data.organizationName);
      fd.append('emailAddress', data.emailAddress);
      fd.append('countryAddress', data.countryAddress);
      fd.append('stateAddress', data.stateAddress);
      fd.append('phoneNumber', data.phoneNumber);
      fd.append('birthday', data.birthday);
      fd.append('role', data.role);
      fd.append('identification', data.identification);
      fd.append('additionalInfo', data.additionalInfo);
      fd.append('profileImage', data.profileImage);
      return this._http.put(`${this.url}update_admin`, fd);
    } else {
      return this._http.put(`${this.url}update_admin`, data);
    }
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









// import { Injectable } from '@angular/core';
// import { Observable, throwError, Subject } from 'rxjs';
// import { tap, catchError } from 'rxjs/operators';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Router } from '@angular/router';
// import { JwtHelperService } from '@auth0/angular-jwt';
// import { LoginCredentials } from 'src/app/core/model';
// import { ApiResponse } from '../model/api-response.interface';
// import { GLOBAL } from '../config/GLOBAL';


// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   private url: string = GLOBAL.url;
//   private headers: HttpHeaders = new HttpHeaders({
//     'Content-Type': 'application/json',
//   });

//   private loginSuccessSubject = new Subject<boolean>();
//   public loginSuccessObservable = this.loginSuccessSubject.asObservable();

//   constructor(private _http: HttpClient, private _router: Router) {}

//   private storeToken(token: string): void {
//     localStorage.setItem('token', token);
//   }

//   private removeToken(): void {
//     localStorage.removeItem('token');
//   }

//   private redirectTo(path: string): void {
//     this._router.navigate([path]);
//   }

//   getToken(): string | null {
//     return localStorage.getItem('token');
//   }

//   private handleError(error: any): Observable<never> {
//     let errorMessage = 'An error occurred during the operation';
//     if (error.error.message) {
//       errorMessage = error.error.message;
//     }
//     console.error('Error:', errorMessage);
//     return throwError(() => new Error(errorMessage));
//   }

//   isAuthenticated(allowRoles: string[]): boolean {
//     const token = this.getToken();


//     if (!token) {
//       return false;
//     }

//     try {
//       const helper = new JwtHelperService();
//       const decodedToken = helper.decodeToken(token);

//       if (!decodedToken || !decodedToken['role']) {
//         this.removeToken();
//         return false;
//       }
//       return allowRoles.includes(decodedToken['role']);
//     } catch (error) {
//       console.error('Error decoding token:', error);
//       this.removeToken();
//       return false;
//     }
//   }

//   check_admin_exists(): Observable<any> {
//     return this._http.get<any>(`${this.url}check_admin_exists`, {
//       headers: this.headers,
//     });
//   }

//   createAdmin(data: any): Observable<any> {
//     return this._http.post(`${this.url}create_admin`, data, {
//       headers: this.headers,
//     });
//   }

//   login_admin(credentials: LoginCredentials): Observable<any> {
//     return this._http
//       .post<ApiResponse>(`${this.url}login_admin`, credentials, {
//         headers: this.headers,
//       })
//       .pipe(
//         tap((response) => {
//           if (response.token) {
//             this.storeToken(response.token);
//             this.redirectTo('/');
//             this.loginSuccessSubject.next(true);
//           }
//         }),
//         catchError((error) => this.handleError(error))
//       );
//   }

//   get_admin(token: any): Observable<any> {
//     const authHeaders = this.headers.set('Authorization', token);
//     return this._http.get(`${this.url}get_admin`, { headers: authHeaders });
//   }

//   logout(): void {
//     this.removeToken();
//     this.redirectTo('auth/login');
//   }
// }

