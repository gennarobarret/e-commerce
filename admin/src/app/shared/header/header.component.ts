import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from "@angular/router";
import { UiIninitService } from 'src/app/services/uiInit.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isCollapsed = true;
  public user: any = { data: {} };

  constructor(
    private _adminService: AdminService,
    private _router: Router,
    private _uiInitService: UiIninitService) { }

  ngOnInit(): void {
    this.fetchUserData();
  
  }

  fetchUserData() {
    const token = localStorage.getItem('token');
    this._adminService.get_admin(token).subscribe(
      response => {
        this.user = response;
        this._uiInitService.activateFeatherIcons();
      },
      error => {
        console.error(error);
      }
    );
  }

  logout(): void {
    this._adminService.logout();
    this._router.navigate(['login']);
  }

  accountSetting(): void {
    this._router.navigate(['profile']);
  }
}
