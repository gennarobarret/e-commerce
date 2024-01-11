import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { BillingComponent } from './billing/billing.component';
import { SecurityComponent } from './security/security.component';
import { NotificationsComponent } from './notifications/notifications.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'profile', component: ProfileComponent },
      { path: 'billing', component: BillingComponent },
      { path: 'security', component: SecurityComponent },
      { path: 'notifications', component: NotificationsComponent }
    ]
  }
  // Puedes agregar más rutas que sean específicas para el módulo de administración
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountSettingsRoutingModule { }
