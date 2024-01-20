import { Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "src/app/core/services/auth.service";
import { ToastService } from "src/app/shared/services/toast.service";
import { User } from "src/app/core/models/user.interface";
import { GeoInfoService } from "src/app/shared/services/geo-info.service";

import { DateService } from "src/app/shared/services/date.service";
import { GLOBAL } from "src/app/core/config/GLOBAL";
import { Renderer2, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { Country } from "src/app/core/models/country.model";
import { State } from "src/app/core/models/state.model";
import { UserManagementService } from "src/app/core/services/user-management.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"]
})
export class ProfileComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;

  updateForm!: FormGroup;
  user: User | null = null;
  countries: Country[] = [];
  states: State[] = [];
  filteredStates: State[] = [];
  load_data: boolean = false;
  load_btn: boolean = false;
  imageUrl: any | ArrayBuffer = 'assets/img/illustrations/profiles/profile-2.png';
  selectedFile: File | null = null;
  url = GLOBAL.url;
  private userName: string = '';
  private userId: string = '';
  private userRole: string = '';
  private userIdentification: string = '';
  private subscriptions = new Subscription();

  constructor(
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _renderer: Renderer2,
    private _authService: AuthService,
    private _toastService: ToastService,
    private _geoInfoService: GeoInfoService,
    private _dataService: DateService,
    private _userManagementService: UserManagementService
  ) {
    this.updateForm = this._formBuilder.group({
      inputUserName: [
        { value: "", disabled: true },
        [Validators.required]
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
      inputCountryAddress: ["", [Validators.required]],
      inputStateAddress: ["", [Validators.required]],
      inputPhoneNumber: [
        "",
        [Validators.required, Validators.pattern("[0-9]+")]
      ],
      inputBirthday: [
        "",
        [Validators.required, this._dataService.validateDate.bind(this)]
      ],
      inputRole: [{ value: "", disabled: true }, [Validators.required]],
      inputIdentification: [
        { value: "", disabled: true },
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
      ],
      inputProfileImage: [""]
    });
  }

  ngOnInit(): void {
    this.fetchUserData();
    this.loadCountries();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initUpdateForm() {
    this.updateForm = this._formBuilder.group({
    });
  }

  fetchUserData() {
    this._userManagementService.getUser().subscribe(
      response => {
        if (response.data === undefined) {
          this._router.navigate([""]);
        } else {
          this.user = response.data as User;
          if (!this.user._id) {
            console.error('Error: _id is missing from the user data');
            return;
          }
          this.userId = this.user._id;
          this.userName = this.user.userName;
          this.userRole = this.user.role;
          this.userIdentification = this.user.identification || '';
          this.updateFormWithUserData(this.user);
          this.filterStatesByCountry(this.user.countryAddress);
        }
      },
      error => {
        console.error(error);
      }
    );
  }

  private updateFormWithUserData(userData: User) {
    let formattedBirthday = '';
    if (userData.birthday) {
      const birthdayDate = new Date(userData.birthday);
      if (!isNaN(birthdayDate.getTime())) {
        // Convierte la fecha a formato ISO y luego extrae solo la parte de la fecha
        formattedBirthday = birthdayDate.toISOString().split('T')[0];
      }
    }


    this.imageUrl = this.url + 'get_picture_profile/' + userData.profileImage;
    this.updateForm.patchValue({
      inputUserName: userData.userName,
      inputFirstName: userData.firstName,
      inputLastName: userData.lastName,
      inputOrganizationName: userData.organizationName,
      inputCountryAddress: userData.countryAddress,
      inputStateAddress: userData.stateAddress,
      inputEmailAddress: userData.emailAddress,
      inputPhoneNumber: userData.phoneNumber,
      inputBirthday: formattedBirthday,
      inputRole: userData.role,
      inputIdentification: userData.identification,
      inputAdditionalInfo: userData.additionalInfo,
      inputCreatedAt: userData.createdAt,
      inputUpdatedAt: userData.updatedAt,
    });
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
    const stateControl = this.updateForm.get("inputState");
    if (stateControl) {
      stateControl.setValue(null);
    }
  }

  onCountryChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const countryId = selectElement.value;
    this.filterStatesByCountry(countryId);
    const stateControl = this.updateForm.get('inputStateAddress');
    if (stateControl) {
      stateControl.setValue("");
    }
  }

  fileChangeEvent(event: Event): void {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement.files && inputElement.files.length > 0) {
      this.selectedFile = inputElement.files[0];
      this.validateAndUpdateImg(this.selectedFile);
    }
  }

  private validateAndUpdateImg(file: File) {
    if (!this.imageUrl && !file) {
      this.updateForm.get('inputProfileImage')!.setErrors({ required: true });
      return;
    }
    if (file) {
      const errors = this.validateFileUpdate(file);
      if (errors) {
        this.updateForm.get('inputProfileImage')!.setErrors(errors);
      }
    }
  }

  private validateFileUpdate(file: File): { [key: string]: any } | null {
    if (file) {
      const validTypes = ['image/png', 'image/webp', 'image/jpg', 'image/gif', 'image/jpeg'];
      if (validTypes.includes(file.type)) {
        if (file.size <= 4000000) {
          let reader = new FileReader();
          reader.readAsDataURL(file);

          reader.onload = () => {
            if (reader.result !== null) {
              this.imageUrl = reader.result as string;
              this.updateForm.patchValue({
                file: reader.result
              });
            }
          }
          return null;
        } else {
          console.error('error', 'The image cannot exceed 4 mb');
          this._toastService.showToast('error', 'The image cannot exceed 4 mb');
          return { invalidFileSize: true };
        }
      } else {
        console.error('The file must be a PNG, WEBP, JPG, GIF, or JPEG image.');
        this._toastService.showToast('error', 'The file must be a PNG, WEBP, JPG, GIF, or JPEG image.');
        return { invalidFileType: true };
      }
    }

    return null;
  }

  triggerFileInput(): void {
    this._renderer.selectRootElement(this.fileInput.nativeElement).click();
  }

  update() {
    if (this.updateForm.invalid) {
      for (const control of Object.keys(this.updateForm.controls)) {
        this.updateForm.controls[control].markAsTouched();
      }
      this.load_btn = false;
      this._toastService.showToast('error', 'There are errors on the form. Please check the fields.');
      return;
    }

    const formValue = this.updateForm.value;
    // console.info('userName:', formValue.inputUserName);
    // console.info('firstName:', formValue.inputFirstName);
    // console.info('lastName:', formValue.inputLastName);
    // console.info('organizationName:', formValue.inputOrganizationName);
    // console.info('emailAddress:', formValue.inputEmailAddress);
    // console.info('countryAddress:', formValue.inputCountryAddress);
    // console.info('stateAddress:', formValue.inputStateAddress);
    // console.info('phoneNumber:', formValue.inputPhoneNumber);
    // console.info('birthday:', formValue.inputBirthday);
    // console.info('role:', formValue.inputRole);
    // console.info('identification:', formValue.inputIdentification);
    // console.info('additionalInfo:', formValue.inputAdditionalInfo);
    // console.info('file:', this.selectedFile);

    const data: any = {};
    if (this.selectedFile) {
      data.profileImage = this.selectedFile;
    }
    data._id = this.userId;
    data.userName = this.userName;
    data.role = this.userRole;
    data.identification = this.userIdentification;
    data.firstName = formValue.inputFirstName;
    data.lastName = formValue.inputLastName;
    data.organizationName = formValue.inputOrganizationName;
    data.emailAddress = formValue.inputEmailAddress;
    data.countryAddress = formValue.inputCountryAddress;
    data.stateAddress = formValue.inputStateAddress;
    data.phoneNumber = formValue.inputPhoneNumber;
    data.birthday = formValue.inputBirthday;
    data.additionalInfo = formValue.inputAdditionalInfo;



    // this.load_btn = true;
    // this._authService.update_admin(data).subscribe(
    //   response => {
    //     this._toastService.showToast('success', 'New profile data has been successfully updated..');
    //     this.load_btn = false;
    //   },
    //   error => {
    //     if (error.status === 404 && error.error.message === 'Admin exists.') {
    //       this._toastService.showToast('error', 'There is already another user associated with that name in the database');
    //     } else {
    //       this._toastService.showToast('error', 'Update failed');
    //     }
    //     this.load_btn = false;
    //   }
    // );
  }

}
