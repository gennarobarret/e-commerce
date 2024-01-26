// account-setup.component.ts
import { Component, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from 'src/app/core/services/validation.service';
import { SharedDataBetweenStepService } from 'src/app/core/services/shared-data-between-step.service';
import { GeoInfoService } from 'src/app/shared/services/geo-info.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { User } from 'src/app/core/models/user.interface';
import { Country } from 'src/app/core/models/country.model';
import { State } from 'src/app/core/models/state.model';
import { forkJoin } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-account-setup',
  templateUrl: './account-setup.component.html',
  styleUrls: ['./account-setup.component.css']
})
export class AccountSetupComponent {
  accountSetupForm!: FormGroup;
  user: User | null = null;
  countries: Country[] = [];
  states: State[] = [];
  filteredStates: State[] = [];
  load_data: boolean = false;
  load_btn: boolean = false;

  constructor(
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _validationService: ValidationService,
    private _renderer: Renderer2,
    private _toastService: ToastService,
    private _geoInfoService: GeoInfoService,
    private _sharedDataBetweenStepService: SharedDataBetweenStepService,
  ) {
    this.accountSetupForm = this._formBuilder.group({
      inputUserName: [
        "",
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(20),
          Validators.pattern("^[a-zA-Z0-9]+$")
        ]
      ],
      inputFirstName: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(25),
          Validators.pattern("^[a-zA-Z0-9\\sñÑ]+$")
        ]
      ],
      inputLastName: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(25),
          Validators.pattern("^[a-zA-Z0-9\\sñÑ]+$")
        ]
      ],
      inputOrganizationName: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          Validators.pattern("^[a-zA-Z0-9\\sñÑ]+$")
        ]
      ],
      inputEmailAddress: ["", [Validators.required, Validators.email]],
      inputPassword: ["", [Validators.required, Validators.minLength(8)]],
      inputConfirmPassword: ["", [Validators.required]],
      inputCountryAddress: ["", [Validators.required]],
      inputStateAddress: ["", [Validators.required]],
      inputPhoneNumber: [
        "",
        [Validators.required, Validators.pattern("[0-9]+")]
      ],
      inputBirthday: [
        "",
        [Validators.required, this._validationService.validateDate.bind(this)]
      ],
      inputRole: [{ value: 'MasterAdministrator', disabled: true }, [Validators.required]],
      inputIdentification: [
        "",
        [Validators.required]
      ],
      inputAdditionalInfo: [
        "",
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(50),
          Validators.pattern("^[a-zA-Z0-9\\sñÑ]+$")
        ]
      ]
    }, { validator: this._validationService.mustMatch('inputPassword', 'inputConfirmPassword') }); // Aquí se añade el validador de mustMatch
  }

  ngOnInit(): void {
    this.loadCountriesAndStates().subscribe(([countries, states]) => {
      if (countries) {
        this.countries = countries.sort((a: Country, b: Country) =>
          a.name.localeCompare(b.name)
        );
      }
      if (states) {
        this.states = states.sort((a: State, b: State) => a.province_name.localeCompare(b.province_name));
      }
      this.restoreFormData();
    });
  }

  restoreFormData() {
    const savedData = this._sharedDataBetweenStepService.getStepData('accountSetup');
    console.log("🚀 ~ AccountSetupComponent ~ restoreFormData ~ savedData:", savedData)
    
    if (!savedData) {
      this._router.navigate([""]);
    } else {
      this.accountSetupForm.patchValue(savedData);
      if (savedData.inputCountryAddress) {
        this.filterStatesByCountry(savedData.inputCountryAddress);
        this.accountSetupForm.get('inputStateAddress')?.setValue(savedData.inputStateAddress);
      }
    }
  }

  private loadCountriesAndStates() {
    return forkJoin([
      this.loadCountries(),
      this.loadStates()
    ]).pipe(
      catchError(error => {
        console.error("Error loading data", error);
        return [[], []]; 
      })
    );
  }

  private loadCountries() {
    return this._geoInfoService.get_Countries()
      .pipe(
        catchError(error => {
          console.error("Error loading countries", error);
          return [];
        })
      );
  }

  private loadStates() {
    return this._geoInfoService.get_States()
      .pipe(
        catchError(error => {
          console.error("Error loading states", error);
          return [];
        })
      );
  }

  filterStatesByCountry(countryId: string | number) {
    const numericCountryId = Number(countryId);
    this.filteredStates = this.states.filter(
      state => state.country_id === numericCountryId
    );
  }

  onCountryChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const countryId = selectElement.value;
    this.filterStatesByCountry(countryId);
  }

  goToNextStep() {
    if (this.accountSetupForm.valid) {
      this._sharedDataBetweenStepService.setStepData('accountSetup', this.accountSetupForm.value);
      this._router.navigate(['/initial-config/step2']);
    } else {
      Object.keys(this.accountSetupForm.controls).forEach(field => {
        const control = this.accountSetupForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      this._toastService.showToast('error', 'Please fill all required fields');
    }
  }
}
