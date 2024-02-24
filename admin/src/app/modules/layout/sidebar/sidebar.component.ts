import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { UIBootstrapService } from 'src/app/core/services/uibootstrap.service';
import { UserManagementService } from "src/app/core/services/user-management.service";


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  public user: any = { data: {} };

  constructor(
    private _authService: AuthService,
    private _uiBootstrapService: UIBootstrapService,
    private _userManagementService: UserManagementService,
  ) { }

  ngOnInit(): void {
    this._uiBootstrapService.closeSideNavigationOnWidthChange();
    this._uiBootstrapService.toggleSideNavigation();
    this._uiBootstrapService.activateFeatherIcons();
    this.fetchUserData();

  }

  fetchUserData() {  
    this._userManagementService.getUser().subscribe(
      response => {
        this.user = response;
      },
      error => {
        console.error(error);

      }
    );
  }
}