import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from './pages.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './account/profile/profile.component';
import { SecurityComponent } from './account/security/security.component';

import { AdminGuard } from '../guards/admin.guard';


const routes: Routes = [
    {
        path: '', component: PagesComponent, canActivate: [AdminGuard],
        children: [
            { path: 'home', component: HomeComponent, canActivate: [AdminGuard] },
            { path: 'profile', component: ProfileComponent, canActivate: [AdminGuard] },
            { path: 'security', component: SecurityComponent, canActivate: [AdminGuard] },
        ],
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class PagesRoutingModule { }