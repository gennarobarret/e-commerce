import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'admin';

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateBodyClass(event.url);
      }
    });
  }

  updateBodyClass(url: string) {
    const body = document.body;
    if (url.startsWith('/register')) {
      body.classList.add('bg-primary"');
    } else if (url.startsWith('/login')) {
      body.classList.add('bg-primary');
    } else {
      body.classList.add('nav-fixed');
    }
  }
}
