import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesRoutingModule } from './pages/pages-routing.module';
import { AuthRoutingModule } from './auth/auth-routing.module';
import { NopageFoundComponent } from './nopage-found/nopage-found.component';


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '404', component: NopageFoundComponent },
  { path: '**', redirectTo: '/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes),
    PagesRoutingModule,
    AuthRoutingModule
  ],

  exports: [RouterModule]
})
export class AppRoutingModule { }

// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
// import { NopageFoundComponent } from './nopage-found/nopage-found.component';

// const routes: Routes = [
//   { 
//     path: '', 
//     redirectTo: 'home', 
//     pathMatch: 'full' 
//   },
//   { 
//     path: '404', 
//     component: NopageFoundComponent 
//   },
//   { 
//     path: 'pages', 
//     loadChildren: () => import('./pages/pages-routing.module').then(m => m.PagesRoutingModule)
//   },
//   { 
//     path: 'auth', 
//     loadChildren: () => import('./auth/auth-routing.module').then(m => m.AuthRoutingModule)
//   },
//   { 
//     path: '**', 
//     redirectTo: '/404' 
//   },
// ];

// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
// })
// export class AppRoutingModule { }
