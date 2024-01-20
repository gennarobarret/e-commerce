// //is-logged-in.guard.ts

// import { Injectable } from '@angular/core';
// import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
// import { AuthService } from '../services/auth.service';

// @Injectable({
//   providedIn: 'root'
// })

// export class isLoggedInGuard implements CanActivate {

//   constructor(
//     private authService: AuthService,
//     private router: Router
//   ) { }

//   canActivate(
//     next: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot): boolean | UrlTree {
//     // Verifica si el usuario está autenticado o tiene los permisos necesarios para acceder a las rutas del LayoutModule
//     if (this.authService.isAuthenticated(['MasterAdministrator'])) {
//       return true;
//     } else {
//       // Si el usuario no está autenticado, redirige a la página de inicio de sesión o a la página que desees.
//       return this.router.createUrlTree(['/auth/login']);
//     }
//   }
// }

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { InitialConfigService } from '../services/initial-config.service';

@Injectable({
  providedIn: 'root',
})
export class isLoggedInGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private initialConfigService: InitialConfigService,
    private router: Router
  ) { }

  canActivate(): Observable<boolean> {
    return this.initialConfigService.InitialCheck().pipe(
      switchMap(response => {
        if (!response.setupRequired) {
          this.router.navigate(['/initial-config']);
          return of(false);
        } else {
          if (this.authService.isAuthenticated(['MasterAdministrator'])) {
            return of(true);
          } else {
            this.router.navigate(['/auth/login']);
            return of(false);
          }
        }
      })
    );
  }
}
