// initial-config.guard.ts
import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { InitialConfigService } from '../services/initial-config.service';

@Injectable({
  providedIn: 'root',
})

export class initialConfigGuard implements CanActivate {
  constructor(
    private _initialConfigService: InitialConfigService,
    private _router: Router
  ) {
  }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this._initialConfigService.InitialCheck().pipe(
      map(response => {
        if (response.setupRequired) {
          return true;
        } else {
          this._router.navigate(['/auth/login']);
          return false;
        }
      })
    );
  }
}