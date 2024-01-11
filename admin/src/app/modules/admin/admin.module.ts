import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './dashboards/admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from './dashboards/user-dashboard/user-dashboard.component';


@NgModule({
  declarations: [
    AdminDashboardComponent,
    UserDashboardComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
