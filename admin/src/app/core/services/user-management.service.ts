import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { GLOBAL } from '../config/GLOBAL';
import { Observable, throwError, Subject, EMPTY } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  private url: string = GLOBAL.url;
  constructor(private _http: HttpClient, private _router: Router) { }


  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      this._router.navigate(['/auth/login']);
      return EMPTY;
    }
    return this._http.get(`${this.url}getUser`);
  }

  createUser(data: any): Observable<any> {
    return this._http.post(`${this.url}create_admin`, data);
  }

  updateUser(data: any): Observable<any> {
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

}
