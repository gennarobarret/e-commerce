import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-verification-pending',
  templateUrl: './verification-pending.component.html',
  styleUrls: ['./verification-pending.component.css']
})
export class VerificationPendingComponent implements OnInit {
  resendEmailForm: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _toastService: ToastService
  ) {
    this.resendEmailForm = this._formBuilder.group({
      inputEmailAddress: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    
  }

  resendVerificationEmail() {
    if (this.resendEmailForm.valid) {
      const email = this.resendEmailForm.get('inputEmailAddress')?.value;
      this._authService.resendVerificationEmail(email).subscribe({
        next: (response) => {
          this._toastService.showToast('success', `Verification Email Sent a ${email}.`);
        },
        error: (error) => {
          this._toastService.showToast('error', 'An error occurred while forwarding the verification email.');
        }
      });
    } else {
      this._toastService.showToast('error', 'Please enter a valid email address.');
    }
  }
}
