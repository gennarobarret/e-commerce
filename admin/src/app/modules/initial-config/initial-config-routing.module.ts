// initial-config-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InitialConfigComponent } from './initial-config.component'; 
import { initialConfigGuard } from 'src/app/core/guards/initial-config.guard';


const routes: Routes = [
  {
    path: '',
    component: InitialConfigComponent, canActivate: [initialConfigGuard],
    children: [

    ],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InitialConfigRoutingModule { }
