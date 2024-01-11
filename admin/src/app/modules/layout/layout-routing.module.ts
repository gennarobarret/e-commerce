import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { isLoggedInGuard } from 'src/app/core/guards/is-logged-in.guard';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [isLoggedInGuard], // Aplica la guarda a las rutas del LayoutModule
    children: [
      // Ruta por defecto redirige al dashboard
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      // Ruta para el módulo Admin
      {
        path: 'dashboard',
        loadChildren: () => import('../admin/admin.module').then(m => m.AdminModule)
      },
      // Ruta para el módulo Account Settings
      {
        path: 'account-settings',
        loadChildren: () => import('../account-settings/account-settings.module').then(m => m.AccountSettingsModule)
      },
      // Ruta de redirección para cualquier otra URL
      { path: '**', redirectTo: '/dashboard' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
