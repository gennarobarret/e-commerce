import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare var handleSignout: any; // Declare the global function to avoid TypeScript errors
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {

  constructor(private router: Router) { }
  userProfile: any;
  ngOnInit() {
    // this.userProfile = JSON.parse(sessionStorage.getItem("loggedInUser") || "");
  }
  handleSignOut() {
    handleSignout();
    localStorage.removeItem("token");
    this.router.navigate(["/auth/login"]).then(() => {
      window.location.reload();
    });
  }

  

}
