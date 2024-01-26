import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedDataBetweenStepService } from 'src/app/core/services/shared-data-between-step.service';

@Component({
  selector: 'app-review-and-submit',
  templateUrl: './review-and-submit.component.html',
  styleUrls: ['./review-and-submit.component.css']
})
export class ReviewAndSubmitComponent implements OnInit {
  formData: any;

  constructor(
    private router: Router,
    private _sharedDataBetweenStepService: SharedDataBetweenStepService
  ) { }

  ngOnInit() {
    this.loadFormData();
  }

  loadFormData() {
    this.formData = this._sharedDataBetweenStepService.getAllData();
    console.log("🚀 ~ ReviewAndSubmitComponent ~ loadFormData ~  this.formData:",  this.formData)


  }

  goToPreviousStep() {
    this.router.navigate(['/initial-config/step3']);
  }

  onSubmit() {
    // Validar formData aquí
    // Enviar datos al servidor
    // Manejo de respuesta y errores
    // Limpiar datos si es necesario
  }
}
