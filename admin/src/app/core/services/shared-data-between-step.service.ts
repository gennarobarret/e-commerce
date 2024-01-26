import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedDataBetweenStepService {
  private formData: any = {};

  setStepData(step: string, data: any) {
    this.formData[step] = data;
    
  }
  
  getStepData(step: string): any {
    return this.formData[step];
  }

  getAllData(): any {
    return this.formData;
  }

}
