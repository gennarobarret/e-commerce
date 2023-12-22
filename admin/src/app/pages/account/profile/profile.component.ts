import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from "@angular/router";
import { UiIninitService } from 'src/app/services/uiInit.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

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

}

