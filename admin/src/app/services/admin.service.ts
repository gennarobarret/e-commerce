import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GLOBAL } from './GLOBAL';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';



@Injectable({
  providedIn: 'root',
})
export class AdminService {

  public url;

  constructor(private _http: HttpClient, private _router: Router) {
    this.url = GLOBAL.url;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  public isAuthenticated(allowRoles: string[]): boolean {
    const token = localStorage.getItem('token');

    if (!token) {
      return false;
    }

    try {
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(token);

      if (!decodedToken || !decodedToken['role']) {
        localStorage.removeItem('token');
        return false;
      }
      return allowRoles.includes(decodedToken['role']);
    } catch (error) {
      console.error('Error decoding token:', error);
      localStorage.removeItem('token');
      return false;
    }
  }

  check_admin_exists(): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get<any>(this.url + 'check_admin_exists', { headers: headers });
  }


  // createAdmin(data: any): Observable<any> {
  //   let headers = new HttpHeaders().set('Content-Type', 'application/json');
  //   const fd = new FormData();
  //   fd.append('firstName', data.firstName);
  //   fd.append('lastName', data.lastName);
  //   fd.append('email', data.email);
  //   fd.append('password', data.password);
  //   return this._http.post(this.url + 'create_admin', fd, { headers: headers });
  // }

  createAdmin(data: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post(this.url + 'create_admin', data, { headers: headers });
}




  login_admin(data: { email: any; password: any }): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post(this.url + 'login_admin', data, {
      headers: headers,
    });
  }

  get_admin(token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.get(this.url + 'get_admin', { headers: headers });
  }

  logout(): void {
    localStorage.removeItem('token');
    this._router.navigate(['/login']);
  }
}
