import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

declare var iziToast: any;

interface ApiResponse {
  data?: any;
  message?: string;
  token?: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public user: any = {};
  public token: any = '';
  public loginForm: FormGroup;

  constructor(
    private _adminService: AdminService,
    private _router: Router,
    private formBuilder: FormBuilder
  ) {
    this.token = this._adminService.getToken();
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false], // Remember me checkbox
    });
  }

  ngOnInit(): void {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      this.loginForm.patchValue({
        email: rememberedEmail,
      });
    }

    if (this.token) {
      this._router.navigate(['']);
    }
  }

  login() {
    if (this.loginForm.valid) {
      const { email, password, rememberMe } = this.loginForm.value;
      const data = { email, password };
      this._adminService.login_admin(data).subscribe(
        (response: ApiResponse) => {
          if (!response.data) {
            this.showErrorToast(
              response.message || 'There was an error during login'
            );
          } else {
            this.handleSuccessfulLogin(response, rememberMe);
          }
        },
        (error) => {
          this.showErrorToast('There was an error during login');
          console.error(error);
        }
      );
    } else {
      this.showErrorToast('Invalid form data');
    }
  }

  private handleSuccessfulLogin(response: ApiResponse, remember: boolean) {
    this.user = response.data;
    localStorage.setItem('token', response.token || '');

    if (remember) {
      this.rememberUser(this.loginForm.value.email, true);
    } else {
      this.rememberUser('', false);
    }

    this._router.navigate(['/']);
  }

  private rememberUser(email: string, remember: boolean) {
    if (remember) {
      localStorage.setItem('rememberedEmail', email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }
  }

  private showErrorToast(message: string) {
    iziToast.show({
      title: 'ERROR',
      titleColor: '#FF0000',
      color: '#FFF',
      class: 'text-Danger',
      position: 'topRight',
      message: message,
    });
  }

  hidePassword: boolean = true;
  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  get passwordFieldType() {
    return this.hidePassword ? 'password' : 'text';
  }
}
