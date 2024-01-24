import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-review-and-submit',
  templateUrl: './review-and-submit.component.html',
  styleUrls: ['./review-and-submit.component.css']
})
export class ReviewAndSubmitComponent {
  constructor(private router: Router) { }


  goToPreviousStep() {
    this.router.navigate(['/initial-config/step3']);
  }

}
