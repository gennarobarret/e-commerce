import { Component } from '@angular/core';
import { GLOBAL } from 'src/app/core/config/GLOBAL';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { ProfileData } from 'src/app/core/model/profile-data';
import { GeoInfoService } from 'src/app/shared/services/geo-info.service';
import { switchMap, catchError, throwError } from 'rxjs';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  updateForm!: FormGroup;
  submitted = false;

  public user: any = {
    data: {},
    address: {
      country: '',
      state: '',
    },
  };
  countries: any[] = [];
  states: any[] = [];

  constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _router: Router,
    private _toastService: ToastService,
    private _geoInfoService: GeoInfoService
  ) {
    this.updateForm = this._formBuilder.group({
      inputUserName: [
        '',
        [
          Validators.required,
          Validators.minLength(12),
          Validators.maxLength(25),
          Validators.pattern(/^\S*$/),
          Validators.pattern(/^[a-zA-Z0-9]*$/),
        ],
      ],
      inputFirstName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(25),
          Validators.pattern('^[a-zA-Z0-9\\sñÑ]+$'),
        ],
      ],
      inputLastName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(25),
          Validators.pattern('^[a-zA-Z0-9\\sñÑ]+$'),
        ],
      ],
      inputOrganizationName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          Validators.pattern('^[a-zA-Z0-9\\sñÑ]+$'),
        ],
      ],
      inputEmailAddress: ['', [Validators.required, Validators.email]],
      inputAddress: this._formBuilder.group({
        street1: ['', [Validators.required]],
        street2: [''],
        city: [''],
        state: ['', [Validators.required]],
        zip: [''],
        country: ['', [Validators.required]],
      }),
      inputPhoneNumber: [
        '',
        [Validators.required, Validators.pattern('[0-9]+')],
      ],
      inputBirthday: ['', [Validators.required, this.validateDate.bind(this)]],
      inputRole: [{ value: '', disabled: true }, [Validators.required]],
      inputIdentification: [
        { value: '', disabled: true },
        [Validators.required],
      ],
      inputAdditionalInfo: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(50),
          Validators.pattern('^[a-zA-Z0-9\\sñÑ]+$'),
        ],
      ],
      inputProfileImage: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {

  }


  // fetchUserData() {
  //   this._authService.get_admin().subscribe(
  //     (response) => {
  //       this.user = response;
  //       if (response.data === undefined) {
  //         this._router.navigate(['']);
  //       } else {
  //         const {
  //           userName,
  //           firstName,
  //           lastName,
  //           organizationName,
  //           emailAddress,
  //           address,
  //           phoneNumber,
  //           birthday,
  //           role,
  //           identification,
  //           additionalInfo,
  //           profileImage,
  //           createdAt,
  //           updatedAt,
  //         } = response.data;
  //         const birthdayFormatted = this.convertDateFormat(
  //           response.data.birthday
  //         );
  //         this.updateForm.patchValue({
  //           inputUserName: userName,
  //           inputFirstName: firstName,
  //           inputLastName: lastName,
  //           inputOrganizationName: organizationName,
  //           inputEmailAddress: emailAddress,
  //           inputPhoneNumber: phoneNumber,
  //           inputBirthday: birthdayFormatted,
  //           inputRole: role,
  //           inputIdentification: identification,
  //           inputAdditionalInfo: additionalInfo,
  //           inputProfileImage: profileImage,
  //           inputCreatedAt: createdAt,
  //           inputUpdatedAt: updatedAt,
  //           inputAddress: {
  //             street1: address.street1,
  //             street2: address.street2,
  //             city: address.city,
  //             state: address.state,
  //             zip: address.zip,
  //             country: address.country,
  //           },
  //         });
  //         this.get_states();
  //         console.log(
  //           '🚀 ~ ProfileComponent ~ get_states ~ this.user.address:',
  //           this.user
  //         );
  //       }
  //     },
  //     (error) => {
  //       // Añade el tipo aquí si es necesario, por ejemplo (error: any)
  //       console.error(error);
  //     }
  //   );
  // }

  // get_country() {
  //   this._geoInfoService.get_Countries().subscribe((response) => {
  //     response.forEach((element: any) => {
  //       this.countries.push({
  //         country_id: element.id,
  //         country_name: element.name,
  //         country_abbrev: element.iso2,
  //         country_phone_code: element.prefix,
  //         country_divGeo: element.divGeo,
  //       });
  //     });
  //     // Sort the countries array by country_name property
  //     this.sortByProperty(this.countries, 'country_name');
  //   });
  // }

  // get_states() {
  //   // Verificar si el país está definido
  //   if (!this.user || !this.user.address || !this.user.address.country) {
  //     console.warn('País del usuario no definido.');
  //     return;
  //   }
  //   this._geoInfoService.get_States().subscribe((response) => {
  //     this.states = [];

  //     response.forEach((element: any) => {
  //       if (element.country_id == this.user.address.country) {
  //         this.states.push({
  //           country_id: element.country_id,
  //           province_abbrev: element.province_abbrev,
  //           province_name: element.province_name,
  //         });
  //       }
  //     });

  //     this.states.sort((a, b) =>
  //       a.province_name.localeCompare(b.province_name)
  //     );
  //   });
  // }

  // onCountryChange() {}

  // private convertDateFormat(dateString: string): string {
  //   const date = new Date(dateString);
  //   const year = date.getFullYear();
  //   const month = String(date.getMonth() + 1).padStart(2, '0');
  //   const day = String(date.getDate()).padStart(2, '0');
  //   return `${year}-${month}-${day}`;
  // }

  private validateDate(control: FormControl): { [key: string]: any } | null {
    const inputDateStr: string = control.value;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(inputDateStr)) {
      return { invalidDateFormat: true };
    }
    return null;
  }

  // sortByProperty(arr: any[], property: string) {
  //   return arr.sort((a, b) => a[property].localeCompare(b[property]));
  // }

  update() {
    this.submitted = true;
  }
}
