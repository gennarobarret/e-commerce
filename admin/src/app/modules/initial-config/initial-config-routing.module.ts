import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WrapperComponent } from './wrapper/wrapper.component';
import { AccountSetupComponent } from './account-setup/account-setup.component';
import { BillingDetailsComponent } from './billing-details/billing-details.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { ReviewAndSubmitComponent } from './review-and-submit/review-and-submit.component';
import { ActivationComponent } from './activation/activation.component';
import { ActivationSuccessComponent } from './activation-success/activation-success.component';
import { ResendEmailVerificationComponent } from './resend-email-verification/resend-email-verification.component';

import { initialConfigGuard } from 'src/app/core/guards/initial-config.guard';

const routes: Routes = [
  {
    path: '',
    component: WrapperComponent,
    children: [
      { path: 'step1', component: AccountSetupComponent },
      { path: 'step2', component: BillingDetailsComponent },
      { path: 'step3', component: PreferencesComponent },
      { path: 'step4', component: ReviewAndSubmitComponent },
      { path: 'activation/:token', component: ActivationComponent },
      { path: 'activation-success', component: ActivationSuccessComponent },
      { path: 'resend-email-verification', component: ResendEmailVerificationComponent },
      { path: '', redirectTo: 'step1', pathMatch: 'full' }
    ],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InitialConfigRoutingModule { }
