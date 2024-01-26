import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InitialConfigRoutingModule } from './initial-config-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

import { AccountSetupComponent } from './account-setup/account-setup.component';
import { BillingDetailsComponent } from './billing-details/billing-details.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { ReviewAndSubmitComponent } from './review-and-submit/review-and-submit.component';
import { WrapperComponent } from './wrapper/wrapper.component';
import { ActivationComponent } from './activation/activation.component';
import { ResendEmailVerificationComponent } from './resend-email-verification/resend-email-verification.component';

@NgModule({
  declarations: [
    AccountSetupComponent,
    BillingDetailsComponent,
    PreferencesComponent,
    ReviewAndSubmitComponent,
    ActivationComponent,
    WrapperComponent,
    ResendEmailVerificationComponent,
    
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InitialConfigRoutingModule
  ]
})

export class InitialConfigModule { }
