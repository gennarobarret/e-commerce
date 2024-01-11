import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { AuthService } from './auth/auth.service';
import { UIBootstrapService } from './services/uibootstrap.service';


import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthTokenInterceptor } from '../interceptors/auth-token.interceptor';


// Importa otros servicios, guardas, interceptores, etc.

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    TooltipModule.forRoot(),
    PopoverModule.forRoot(),
    CollapseModule.forRoot()
  ],
  providers: [
    AuthService,
    UIBootstrapService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true },
    // Otros servicios, guardas e interceptores
  ],
})
export class CoreModule { 
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}

// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';



// @NgModule({
//   declarations: [],
//   imports: [
//     CommonModule
//   ]
// })
// export class CoreModule { }

