import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './dashboards/admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from './dashboards/user-dashboard/user-dashboard.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: AdminDashboardComponent },
      // ... otras rutas específicas del módulo de administración
      // Ejemplo: { path: 'some-feature', component: SomeFeatureComponent }
    ]
  }
  // Puedes agregar más rutas que sean específicas para el módulo de administración
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
