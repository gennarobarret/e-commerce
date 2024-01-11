import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';


import { AccountSettingsRoutingModule } from './account-settings-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { BillingComponent } from './billing/billing.component';
import { SecurityComponent } from './security/security.component';
import { NotificationsComponent } from './notifications/notifications.component';


@NgModule({
  declarations: [
    ProfileComponent,
    BillingComponent,
    SecurityComponent,
    NotificationsComponent
  ],
  imports: [
    CommonModule,
    AccountSettingsRoutingModule,
    ReactiveFormsModule
  ]
})
export class AccountSettingsModule { }
