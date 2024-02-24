import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { InitialConfigService } from '../services/initial-config.service';

@Injectable({
  providedIn: 'root',
})
export class MasterAdminSetupGuard implements CanActivate {
  constructor(
    private initialConfigService: InitialConfigService,
    private router: Router
  ) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.initialConfigService.InitialCheck().pipe(
      map((response) => {
        if (response.verificationRequired) {
          // Si ya existe un masterAdministrator pero falta la verificación,
          // redirige a la página de verificación pendiente.
          this.router.navigate(['/initial-config/verification-pending']);
          return false;
        }
        // Permite el acceso si no se cumple la condición anterior.
        return true;
      })
    );
  }
}
