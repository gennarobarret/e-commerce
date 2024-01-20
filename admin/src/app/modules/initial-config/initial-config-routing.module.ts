// initial-config-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InitialConfigComponent } from './initial-config.component'; 


const routes: Routes = [
  {
    path: '',
    component: InitialConfigComponent,
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
