import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { InitialConfigService } from '../services/initial-config.service';
import { first } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class initialConfigGuard implements CanActivate {
  constructor(
    private _initialConfigService: InitialConfigService,
    private _router: Router
  ) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this._initialConfigService.InitialCheck().pipe(
      first(),
      map(response => {
        if (response.setupRequired) {
          // Permitir acceso a la ruta de configuración inicial
          return true;
        } else if (response.verificationRequired) {
          // Redirigir a la ruta de reenvío de correo si la verificación es necesaria
          this._router.navigate(['/initial-config/resend-email-verification']);
          return false;
        } else {
          // Redirigir al login si no se requiere configuración ni activación
          this._router.navigate(['/auth/login']);
          return false;
        }
      })

    );
  }
}