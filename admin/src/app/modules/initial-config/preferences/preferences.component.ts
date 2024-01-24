import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css']
})
export class PreferencesComponent {
  constructor(private router: Router) { }

  goToNextStep() {
    this.router.navigate(['/initial-config/step4']);
  }
  goToPreviousStep() {
    this.router.navigate(['/initial-config/step2']);
  }
}
