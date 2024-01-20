//app-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'initial-config',
    loadChildren: () =>
      import('./modules/initial-config/initial-config.module').then((m) => m.InitialConfigModule)
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule)
  },
  {
    path: '',
    loadChildren: () =>
      import('./modules/layout/layout.module').then((m) => m.LayoutModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }

// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
// import { RootGuard } from './core/guards/root-guard.guard';

// const routes: Routes = [
//   {
//     path: '',
//     canActivate: [RootGuard],
//     children: [
//       {
//         path: 'auth',
//         loadChildren: () =>
//           import('./modules/auth/auth.module').then((m) => m.AuthModule),
//       },
//       {
//         path: 'initial-config',
//         loadChildren: () =>
//           import('./modules/initial-config/initial-config.module').then((m) => m.InitialConfigModule),
//       },
//       {
//         path: '',
//         loadChildren: () =>
//           import('./modules/layout/layout.module').then((m) => m.LayoutModule),
//       },

//     ],
//   },

// ];

// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule],
// })
// export class AppRoutingModule { }

