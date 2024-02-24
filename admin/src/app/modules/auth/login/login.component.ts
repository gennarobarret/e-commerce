import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { LoginCredentials } from 'src/app/core/models';

declare var google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
  ) {

    this.loginForm = this.formBuilder.group({
      userName: ['', [Validators.required]],
      password: ['', Validators.required],
    });

  }

  get f() {
    return this.loginForm.controls;
  }

  ngOnInit(): void {
    if (this.authService.getToken()) {
      this.router.navigate(['']);

    }
  }

  login() {
    this.submitted = true;
    if (this.loginForm.valid) {
      this.authService
        .loginUser(this.loginForm.value as LoginCredentials)
        .subscribe(
          (response) => {
          },
          (error: HttpErrorResponse) => {
            let errorMessage = 'Invalid credentials';
            if (error.error && error.error.message) {
              errorMessage = error.error.message;
            }
            this.toastService.showToast('error', errorMessage);
          }
        );
      this.handleSuccessfulLogin();

    } else {
      this.toastService.showToast('error', 'Missing form data');
    }
  }

  private handleSuccessfulLogin() {
    this.authService.loginSuccessObservable.subscribe((success: boolean) => {
      if (success) {
        this.toastService.showToast(
          'success',
          'Welcome ' + this.loginForm.value.userName
        );
      }
    });
  }

}
