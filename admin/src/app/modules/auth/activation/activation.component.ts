import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-activation',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.css']
})

export class ActivationComponent implements OnInit {

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _authService: AuthService
  ) { }

  ngOnInit() {
    const token = this._route.snapshot.paramMap.get('token');
    if (token) {
      this._authService.activateAccount(token).subscribe({
        next: (response) => {
          // Manejar respuesta exitosa
          // Redirigir al usuario a la página de inicio de sesión o confirmación
          this._router.navigate(['/auth/login']);
        },
        error: (error) => {
          // Manejar errores (token inválido, cuenta ya activada, etc.)
        }
      });
    }
  }
}
