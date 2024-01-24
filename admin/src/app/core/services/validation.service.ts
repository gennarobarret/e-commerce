import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
  
export class ValidationService {

  constructor() { }

  validateDate(control: FormControl): { [key: string]: any } | null {
    const inputDateStr: string = control.value;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(inputDateStr)) {
      return { invalidDateFormat: true };
    }
    return null;
  }

  mustMatch(controlName: string, matchingControlName: string) {
    return (group: AbstractControl) => {
      const control = group.get(controlName);
      const matchingControl = group.get(matchingControlName);

      if (!control || !matchingControl) {
        return null;
      }

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return null;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }

      return null;
    };
  }

}
