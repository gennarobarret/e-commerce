import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';

import { showToastMessage } from 'src/app/helpers/toast-messages';

// import custom validator to validate that password and confirm password fields match
import { MustMatch } from 'src/app/helpers/must-match.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  submitted = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _adminService: AdminService,
    private _router: Router
  ) {}

  ngOnInit() {
    this.registerForm = this._formBuilder.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        // acceptTerms: [false, Validators.requiredTrue]
      },
      {
        validators: MustMatch('password', 'confirmPassword'),
      }
    );
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  register() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    const newAdminFormValue = {
      ...this.registerForm.value,
      role: 'admin',
    };
    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerForm.value, null, 4));

    this._adminService.createAdmin(newAdminFormValue).subscribe(
      (response) => {
        showToastMessage('success', 'Tu mensaje de éxito aquí');
        this._router.navigate(['/login']);
      },
      (error) => {
        showToastMessage('error', 'Tu mensaje de error aquí');
        console.error(error);
      }
    );
  }

  onReset() {
    this.submitted = false;
    this.registerForm.reset();
  }
}
