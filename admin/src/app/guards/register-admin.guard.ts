import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AdminService } from 'src/app/services/admin.service';

@Injectable({
  providedIn: 'root',
})
export class RegisterAdminGuard implements CanActivate {
  constructor(private _adminService: AdminService, private _router: Router) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this._adminService.check_admin_exists().pipe(
      map(response => {
        if (response.setupRequired) {
          // Si no hay administrador, permitir acceso a la página de registro
          return true;
        } else {
          // Si ya existe un administrador, redirigir al login
          this._router.navigate(['/login']);
          return false;
        }
      })
    );
  }
}
