import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';

import { ActivationComponent } from './activation/activation.component';
import { VerificationPendingComponent } from './verification-pending/verification-pending.component';
import { CreateMasterAdminComponent } from '../auth/create-master-admin/create-master-admin.component';
import { ReactiveFormsModule } from '@angular/forms';
import { GoogleSigninComponent } from './google-signin/google-signin.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
  declarations: [
    LoginComponent,
    CreateMasterAdminComponent,
    ActivationComponent,
    VerificationPendingComponent,
    GoogleSigninComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule
  ]
})
export class AuthModule { }
