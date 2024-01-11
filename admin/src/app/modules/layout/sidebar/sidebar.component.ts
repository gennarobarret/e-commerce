import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth/auth.service';
import { UIBootstrapService } from 'src/app/core/services/uibootstrap.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  public user: any = { data: {} };

  constructor(
    private _authService: AuthService, 
    private _uiBootstrapService: UIBootstrapService
    ) { }

  ngOnInit(): void {
    this._uiBootstrapService.closeSideNavigationOnWidthChange();
    this._uiBootstrapService.toggleSideNavigation();
    this._uiBootstrapService.activateFeatherIcons();
    this.fetchUserData();
  }

  fetchUserData() {
    this._authService.get_admin().subscribe(
      response => {
        this.user = response;
      },
      error => {
        console.error(error);
        
      }
    );
  }
}

// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-sidebar',
//   templateUrl: './sidebar.component.html',
//   styleUrls: ['./sidebar.component.css']
// })
// export class SidebarComponent {

// }
