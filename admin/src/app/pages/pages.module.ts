import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { PagesComponent } from './pages.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './account/profile/profile.component';
import { SecurityComponent } from './account/security/security.component';

// import { NopageFoundComponent } from '../nopage-found/nopage-found.component';



@NgModule({
    declarations: [
        PagesComponent,
        HomeComponent,
        ProfileComponent, 
        SecurityComponent,       
        // NopageFoundComponent
        
    ],
    exports: [
        PagesComponent,
        HomeComponent,
        ProfileComponent, 
        SecurityComponent,       
        // NopageFoundComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule,
        FormsModule
    ]
})
export class PagesModule { }