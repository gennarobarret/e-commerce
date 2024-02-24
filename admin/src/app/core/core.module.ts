import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
// import { OAuthModule } from 'angular-oauth2-oidc';
import { AuthService } from './services/auth.service';
import { InitialConfigService } from './services/initial-config.service';
import { UserManagementService } from './services/user-management.service';
import { UIBootstrapService } from './services/uibootstrap.service';
import { ValidationService } from './services/validation.service';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthTokenInterceptor } from '../interceptors/auth-token.interceptor';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { CollapseModule } from 'ngx-bootstrap/collapse';




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
    InitialConfigService,
    ValidationService,
    UIBootstrapService,
    UserManagementService,
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
