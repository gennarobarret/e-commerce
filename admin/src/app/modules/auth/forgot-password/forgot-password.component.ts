import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { ForgotPasswordRequest } from 'src/app/core/models/forgot-password.interface';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  forgotPasswordForm = new FormGroup({
    inputForgotEmailAddress: new FormControl('', [Validators.required, Validators.email]),
  });

  load_btn: boolean = false;

  constructor(
    private _authService: AuthService,
    private _toastService: ToastService
  ) { }

  onSubmit(): void {
    this.load_btn = true;
    if (this.forgotPasswordForm.valid) {
      // Corrige aquí para usar el nombre correcto del control del formulario
      const emailAddress = this.forgotPasswordForm.get('inputForgotEmailAddress')?.value;

      // Asegúrate de que emailAddress no es null antes de llamar al servicio
      if (emailAddress) {
        this._authService.forgotPassword({ emailAddress }).subscribe({
          next: (response) => {
            // Maneja la respuesta exitosa aquí
            this._toastService.showToast('success', 'If the email exists in our system, a password reset link will be sent.');
            this.forgotPasswordForm.reset();
            this.load_btn = false;
          },
          error: (error) => {
            // Maneja los errores aquí
            this._toastService.showToast('error', 'An error occurred while trying to send the password reset link.');
            console.error(error);
            this.load_btn = false;
          }
        });
      }
    } else {
      // Manejar el caso en que el formulario no es válido
      this.load_btn = false;
      this._toastService.showToast('error', 'Please enter a valid email address.');
    }
  }
}
