import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

declare var google: any;

interface GoogleSignInResponse {
  clientId: string;
  credential: string;
  select_by: string;
}

@Component({
  selector: 'app-google-signin',
  templateUrl: './google-signin.component.html',
  styleUrls: ['./google-signin.component.css']
})

export class GoogleSigninComponent implements OnInit {
  constructor(
    private _router: Router,
    private _authService: AuthService,
    private _ngZone: NgZone 
  ) { } 

  ngOnInit(): void {
    this.renderButton();
  }

  renderButton() {
    google.accounts.id.initialize({
      client_id: "142003720401-scrooc5tq3p8ht8m377p67kdrt3ablei.apps.googleusercontent.com",
      callback: (response: GoogleSignInResponse) => this.onSignIn(response),
    });

    google.accounts.id.renderButton(
      document.getElementById("g_id_onload"),
      { theme: "outline", size: "large" }
    );

    google.accounts.id.prompt();
  }

  onSignIn(response: GoogleSignInResponse) {
    console.log('Usuario ha iniciado sesión:', response);
    const userToken = response.credential;

    this._authService.authenticateWithGoogle(userToken).subscribe({
      next: (data) => {
        console.log('Datos del usuario guardados/recuperados:', data);
        // Usar NgZone para navegar
        this._ngZone.run(() => {
          this._router.navigate(['/dashboard']); // Navegar a otra vista tras la autenticación exitosa
        });
      },
      error: (error) => {
        console.error('Error al enviar token al backend:', error);
        // Aquí puedes manejar errores, como mostrar un mensaje al usuario
        // Considera también usar NgZone si necesitas realizar cambios en la UI en respuesta a errores
      }
    });
  }



}
