// import { CanActivateFn } from '@angular/router';

// export const isLoggedInGuard: CanActivateFn = (route, state) => {
//   return true;
// };

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service'; // Asegúrate de que la ruta sea correcta

@Injectable({
  providedIn: 'root'
})
export class isLoggedInGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | UrlTree {
    // Verifica si el usuario está autenticado o tiene los permisos necesarios para acceder a las rutas del LayoutModule
    if (this.authService.isAuthenticated(['admin'])) {
      return true;
    } else {
      // Si el usuario no está autenticado, redirige a la página de inicio de sesión o a la página que desees.
      return this.router.createUrlTree(['/auth/login']);
    }
  }
}
