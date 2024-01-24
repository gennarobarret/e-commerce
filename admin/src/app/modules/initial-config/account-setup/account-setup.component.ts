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
      inputPassword: ['', [Validators.required, Validators.minLength(8)]],
      inputConfirmPassword: ['', [Validators.required]]
    }, {
      validator: this._validationService.mustMatch('inputPassword', 'inputConfirmPassword'),
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
      inputRole: [{ value: "MasterAdministrator", disabled: true }, [Validators.required]],
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
    });
  }


  ngOnInit(): void {
    this.loadCountries();
  }


  private loadCountries() {
    this._geoInfoService.get_Countries().subscribe(
      data => {
        this.countries = data.sort((a: Country, b: Country) =>
          a.name.localeCompare(b.name)
        );
        this.loadStates();
      },
      error => {
        console.error("Error loading countries", error);
      }
    );
  }

  private loadStates() {
    this._geoInfoService.get_States().subscribe(
      data => {
        this.states = data.sort((a: State, b: State) =>
          a.province_name.localeCompare(b.province_name)
        );
      },
      error => {
        console.error("Error loading states", error);
      }
    );
  }

  filterStatesByCountry(countryId: string | number) {
    const numericCountryId = Number(countryId);
    this.filteredStates = this.states.filter(
      state => state.country_id === numericCountryId
    );
    const stateControl = this.accountSetupForm.get("inputState");
    if (stateControl) {
      stateControl.setValue(null);
    }
  }

  onCountryChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const countryId = selectElement.value;
    this.filterStatesByCountry(countryId);
    const stateControl = this.accountSetupForm.get('inputStateAddress');
    if (stateControl) {
      stateControl.setValue("");
    }
  }


  goToNextStep() {
    const savedData = this._sharedDataBetweenStepService.getStepData('accountSetup');
    if (savedData) {
      this.accountSetupForm.patchValue(savedData);
    }
    this._sharedDataBetweenStepService.setStepData('accountSetup', this.accountSetupForm.value);
    this._router.navigate(['/initial-config/step2']);
  }
  goToPreviousStep() {
    this._sharedDataBetweenStepService.setStepData('accountSetup', this.accountSetupForm.value);
    this._router.navigate(['/initial-config/step1']);
  }

}

