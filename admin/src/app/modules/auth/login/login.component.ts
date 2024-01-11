import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { LoginCredentials } from 'src/app/core/model';

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
    private toastService: ToastService
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
        .login_admin(this.loginForm.value as LoginCredentials)
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

  private handleSuccessfulLogin(){
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




// import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
//  import { Router } from '@angular/router';
// import { AuthService } from 'src/app/core/auth/auth.service';
// import { ToastService } from 'src/app/shared/services/toast.service';
// import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// import { catchError, finalize } from 'rxjs/operators';
// import { throwError } from 'rxjs';

// interface ApiResponse {
//   data?: any;
//   token?: string;
// }

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css'],
//   changeDetection: ChangeDetectionStrategy.OnPush
// })
// export class LoginComponent implements OnInit {
//   public user: any = {};
//   public token: any = '';
//   public loginForm: FormGroup;

//   constructor(
//     private formBuilder: FormBuilder,
//     private _authService: AuthService,
//     private _router: Router,
//     private _toastService: ToastService
//   ) {
//     this.token = this._authService.getToken();
//     this.loginForm = this.formBuilder.group({
//       userName: ['', [Validators.required, Validators.userName]],
//       password: ['', Validators.required],
//     });
//   }

//   ngOnInit(): void {
//     if (this.token) {
//       this._router.navigate(['']);
//     }
//   }

//   login() {
//     if (this.loginForm.valid) {
//       const { userName, password } = this.loginForm.value;
//       const data = { userName, password };
//       this._authService.login_admin(data).subscribe(
//         (response: ApiResponse) => {
//           if (!response.data) {
//             this._toastService.showToast('error', 'There was an error during login');
//           } else {
//             this.handleSuccessfulLogin(response);
//           }
//         },
//         (error) => {
//           this._toastService.showToast('error', 'There was an error during login');
//           console.error(error);
//         }
//       );
//     } else {
//       this._toastService.showToast('error', 'Invalid form data');
//     }
//   }

//   private handleSuccessfulLogin(response: ApiResponse) {
//     this.user = response.data;
//     localStorage.setItem('token', response.token || '');
//     this._router.navigate(['/']);
//   }

// }

// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css']
// })
// export class LoginComponent {

// }
