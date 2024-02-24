import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WrapperComponent } from './wrapper/wrapper.component';
import { AccountSetupComponent } from './account-setup/account-setup.component';
import { BusinessSetupComponent } from './business-setup/business-setup.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { ReviewAndSubmitComponent } from './review-and-submit/review-and-submit.component';
import { MasterAdminSetupGuard } from 'src/app/core/guards/master-admin-setup.guard';


const routes: Routes = [
  // {
  //   path: '',
  //   component: WrapperComponent,
  //   children: [
  //     { path: '', redirectTo: 'step1', pathMatch: 'full' },
  //     { path: 'step1', component: AccountSetupComponent },
  //     { path: 'step2', component: BusinessSetupComponent },
  //     { path: 'step3', component: PreferencesComponent },
  //     { path: 'step4', component: ReviewAndSubmitComponent },
  //   ],
  // },
  // { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InitialConfigRoutingModule { }
