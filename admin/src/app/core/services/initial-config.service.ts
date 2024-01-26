//initial-config.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { GLOBAL } from '../config/GLOBAL';
import { Observable, catchError, map, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class InitialConfigService {

  private url: string = GLOBAL.url;
  constructor(private _http: HttpClient, private _router: Router) { }

  InitialCheck(): Observable<{ setupRequired: boolean, verificationRequired: boolean }> {
    return this._http.get<{ status: string, message: string, data: { setupRequired: boolean, verificationRequired: boolean } }>(`${this.url}/InitialCheck`)
      .pipe(
        map(response => response.data),
        catchError(error => {
          console.error('Error en InitialCheck:', error);
          return of({ setupRequired: false, verificationRequired: false });
        })
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


}
