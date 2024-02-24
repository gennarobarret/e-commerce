//auth-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { VerificationPendingComponent } from './verification-pending/verification-pending.component';
import { ActivationComponent } from './activation/activation.component';
import { CreateMasterAdminComponent } from './create-master-admin/create-master-admin.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';




const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
      { path: 'create-Master-Admin', component: CreateMasterAdminComponent },
      { path: 'login', component: LoginComponent },
      { path: 'verification-pending', component: VerificationPendingComponent },
      { path: 'activation/:token', component: ActivationComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'reset-password', component: ResetPasswordComponent }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule { }