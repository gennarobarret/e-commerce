import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nopage-found',
  templateUrl: './nopage-found.component.html',
  styleUrls: ['./nopage-found.component.css']
})
export class NopageFoundComponent {
  constructor(private router: Router) { }

  returnToDashboard(): void {
    this.router.navigate(['home']);
  }
}
