import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InitialConfigService } from 'src/app/core/services/initial-config.service';

@Component({
  selector: 'app-activation',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.css']
})

export class ActivationComponent implements OnInit {
  token!: string;

  constructor(
    private _route: ActivatedRoute,
    private _initialConfigService: InitialConfigService
  ) { }

  ngOnInit() {
    this.token = this._route.snapshot.paramMap.get('token') || '';
    if (!this.token) {
      // Manejar la ausencia del token, por ejemplo, redirigir o mostrar un mensaje
    }
  }

  activateAccount() {
    this._initialConfigService.activateAccount(this.token).subscribe({
      next: (response) => {
        // Manejar la respuesta positiva (redirigir al usuario, mostrar mensaje, etc.)
      },
      error: (error) => {
        // Manejar errores (mostrar mensaje de error, etc.)
      }
    });
  }

}
