import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from "@angular/router";
import { UIBootstrapService } from 'src/app/core/services/uibootstrap.service';
import { UserManagementService } from "src/app/core/services/user-management.service";

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
    private _uiBootstrapService: UIBootstrapService,
    private _userManagementService: UserManagementService,
  ) { }


  ngOnInit(): void {
    this.fetchUserData();
  }

  fetchUserData() {
    this._userManagementService.getUser().subscribe(
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

