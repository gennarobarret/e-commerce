import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth/auth.service';
import { Router } from "@angular/router";
import { UIBootstrapService } from 'src/app/core/services/uibootstrap.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isCollapsed = true;
  public user: any = { data: {} };

  constructor(
    private _authService: AuthService,
    private _router: Router,
    private _uiBootstrapService: UIBootstrapService) { }

  ngOnInit(): void {
    this.fetchUserData();
  
  }

  fetchUserData() {
    this._authService.get_admin().subscribe(
      response => {
        this.user = response;
        this._uiBootstrapService.activateFeatherIcons();
      },
      error => {
        console.error(error);
      }
    );
  }

  logout(): void {
    this._authService.logout();
  }

  accountSetting(): void {
    this._router.navigate(['/profile']);
  }

}

// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-header',
//   templateUrl: './header.component.html',
//   styleUrls: ['./header.component.css']
// })
// export class HeaderComponent {

// }