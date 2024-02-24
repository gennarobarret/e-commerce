
// setup-verification.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { InitialConfigService } from '../services/initial-config.service';

@Injectable({
  providedIn: 'root'
})
export class SetupVerificationGuard implements CanActivate {
  constructor(private setupService: InitialConfigService, private router: Router) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.setupService.InitialCheck().pipe(
      map(response => {
        if (response.setupRequired === true && response.verificationRequired === false) {
          this.router.navigate(['/initial-config/step1']);
          return false;
        } else if (response.setupRequired === false && response.verificationRequired === true) {
          this.router.navigate(['/initial-config/verification-pending']);
          return false;
        }
        return true;
      }),
      catchError((error) => {
        // Maneja cualquier error aquí
        console.error(error);
        return of(true); // O redirige a una página de error según sea necesario
      })
    );
  }
}
