// import { Injectable } from '@angular/core';
// import { CanActivate, Router } from '@angular/router';
// import { InitialConfigService } from '../services/initial-config.service';
// import { Observable, catchError, map, of } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class RootGuard implements CanActivate {
//   constructor(
//     private initialConfigService: InitialConfigService,
//     private router: Router
//   ) { }

//   canActivate(): Observable<boolean> | boolean {
//     const setupRequiredLocal = this.initialConfigService.needsInitialConfiguration();

//     if (setupRequiredLocal === null) {
//       return this.initialConfigService.InitialCheck().pipe(
//         map(response => {
//           if (response.data.setupRequired) {
//             this.router.navigate(['/initial-config']);
//             return false;
//           }
//           return true;
//         }),
//         catchError(() => {
//           this.router.navigate(['/auth/login']);
//           return of(false);
//         })
//       );
//     } else if (setupRequiredLocal) {
//       this.router.navigate(['/initial-config']);
//       return false;
//     }
//     return true;
//   }
// }
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { InitialConfigService } from '../services/initial-config.service';

@Injectable({
    providedIn: 'root',
})
export class RootGuard implements CanActivate {
    constructor(
        private initialConfigService: InitialConfigService,
        private router: Router
    ) { }

    canActivate(): Observable<boolean> {
        return this.initialConfigService.InitialCheck().pipe(
            switchMap(response => {
                if (response.setupRequired) {
                    // Si se requiere configuración inicial, redirige a la ruta de configuración inicial
                    this.router.navigate(['/initial-config']);
                    return of(false);
                }
                // Si no se requiere configuración inicial, permite el acceso a /auth/login
                return of(true);
            })
        );
    }
}
