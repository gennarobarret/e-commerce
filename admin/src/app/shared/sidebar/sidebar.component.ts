import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { UiIninitService } from 'src/app/services/uiInit.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  public user: any = { data: {} };

  constructor(
    private _adminService: AdminService, 
    private _uiInitService: UiIninitService
    ) { }

  ngOnInit(): void {
    this._uiInitService.closeSideNavigationOnWidthChange();
    this._uiInitService.toggleSideNavigation();
    this._uiInitService.activateFeatherIcons();
    
    this.fetchUserData();
  }

  fetchUserData() {
    const token = localStorage.getItem('token');
    this._adminService.get_admin(token).subscribe(
      response => {
        this.user = response;
        console.log("🚀 ~ file: sidebar.component.ts:23 ~ SidebarComponent ~ fetchUserData ~ this.user:", this.user)
      },
      error => {
        console.error(error);
        
      }
    );
  }
}