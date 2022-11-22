import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { GlobalService } from 'src/app/services/global.service';
import { CONSTANTS } from '../../common/constants';
import { ProfileService } from './profile.service';
import { GlobalFunctions } from '../../common/global-functions';
import * as moment from 'moment';
import { SnotifyService } from 'ng-snotify';
declare let $: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  isLoading: boolean = false;
  isImageLoading: boolean = false;
  constants: any = CONSTANTS;
  isEditProfile: boolean = false;
  isEditBusinessProfile: boolean = false;
  profile_pic: any = '';
  business_profile_pic: any = '';
  profileForm: any;
  businessForm: any;
  profileObj: any = {};
  businessObj: any = {};
  maxDate: Date = new Date();

  get profileFirstName() {
    return this.profileForm.get('name')
  }

  get profileDob() {
    return this.profileForm.get('dob')
  }

  get profileCity() {
    return this.profileForm.get('city')
  }

  get profilePincode() {
    return this.profileForm.get('pincode')
  }

  get profileState() {
    return this.profileForm.get('state')
  }

  get profileCountry() {
    return this.profileForm.get('country')
  }

  get businessFirstName() {
    return this.businessForm.get('name')
  }

  get businessDob() {
    return this.businessForm.get('dob')
  }

  get businessAddress() {
    return this.businessForm.get('address')
  }

  get businessCountry() {
    return this.businessForm.get('country')
  }

  constructor(
    private _formBuilder: FormBuilder,
    private _globalService: GlobalService,
    private _globalFunctions: GlobalFunctions,
    private _sNotify: SnotifyService,
    private _profileService: ProfileService) {
  }


  ngOnInit(): void {
    this.maxDate = new Date();
    this._prepareProfileForm();
    this._prepareBusinessForm();
    // this._getUserDetail();
    
    this._globalService.loginUser$.subscribe((user: any) => {
      this.isLoading = true;
      if (user) {
        this.profileObj = user;
        this._prepareProfileForm(this.profileObj);
        this.profile_pic = CONSTANTS.baseImageURL + this.profileObj.profile_pic;
        this.isLoading = false;
      }
    });
  }

  // private _getUserDetail(): void {
  //   this.isLoading = true;
  //   this._authService.getLoginUser().subscribe((result: any) => {
  //     if (result.IsSuccess) {
  //       this.profileObj = result.user;
  //       this._prepareProfileForm();
  //       this.isLoading = false;
  //     }
  //   });
  // }

  onUpdateProfilePic(event: any, isBusinessProfile: boolean = false): void {
    if (event.target.files && event.target.files[0]) {
      this.isImageLoading = true;
      const file = event.target.files[0];
      const profilePicObj: any = new FormData();
      profilePicObj.append('file', file);
      this._profileService.updateProfilePic(profilePicObj, isBusinessProfile).subscribe((result: any) => {
        if (result && result.IsSuccess) {
          this._globalService.loginUser$.next(result.Data);
          this._sNotify.success(result.msg, 'Success');
          this.enableFields();
          this.isImageLoading = false;
          // window.location.reload();
        } else {  
          this._globalFunctions.successErrorHandling(result, this, true);
        }
      }, (error: any) => {
        this.isImageLoading = false;
        this._globalFunctions.errorHanding(error, this, true);
      });
    }
  }

  updatePersonalProfile(): any {
    if (this.profileForm.invalid) {
      Object.keys(this.profileForm.controls).forEach((key) => {
        this.profileForm.controls[key].touched = true;
        this.profileForm.controls[key].markAsDirty();
      });
      return;
    }

    if (this.profileForm.valid) {
      this.profileForm.value.dob = moment(this.profileForm.value.dob).format('DD-MM-YYYY');
      const preparedProfileObj: any = this._globalFunctions.copyObject(this.profileForm.value);
      this.isLoading = true;
      this._profileService.updateProfile(preparedProfileObj).subscribe((result: any) => {
        if (result && result.IsSuccess) {
          this._globalService.loginUser$.next(result.Data);
          this._sNotify.success(result.msg, 'Success');
          // this.enableFields();
          this.isLoading = false;
          // window.location.reload();
        } else {  
          this._globalFunctions.successErrorHandling(result, this, true);
        }
      }, (error: any) => {
        this.isLoading = false;
        this._globalFunctions.errorHanding(error, this, true);
      });
    }
  }

  preparePersonalProfileObj(personalProfileObj: any): any {
    const personalProfileDataObj = new FormData();
    $.each(personalProfileObj, function (field: any, value: any) {
      if (field !== 'profile_pic' && field !== 'isChangeProfilePic') {
        personalProfileDataObj.append(field, value);
      }
    });
    
    const profile_pic = $('input[id=profile_pic]')[0].files[0];
    if (profile_pic !== undefined) {
      personalProfileDataObj.append('profile_pic', profile_pic);
    }

    return personalProfileDataObj;
  }

  updateBusinessProfile() {
    if (this.businessForm.valid) {
      console.log('submitBusinessForm');
    }
  }

  enableFields(isBusinessProfile: boolean = false): void {
    if (isBusinessProfile) {
      this.isEditBusinessProfile = true;
      this.businessForm.get('name').enable();
      this.businessForm.get('address').enable();
      this.businessForm.get('dob').enable();
      this.businessForm.get('country').enable();
      this.businessForm.get('about').enable();
    } else {
      this.isEditProfile = true;
      this.profileForm.get('name').enable();
      this.profileForm.get('dob').enable();
      this.profileForm.get('city').enable();
      this.profileForm.get('pincode').enable();
      this.profileForm.get('state').enable();
      this.profileForm.get('country').enable();
      this.profileForm.get('about').enable();
    }
  }

  private _prepareProfileForm(personalProfileObj: any = {}): void {
    const preparedDOB: any = moment(personalProfileObj?.dob, 'DD-MM-YYYY');
    this.profileForm = this._formBuilder.group({
      name: [{ value: personalProfileObj?.name, disabled: true }, [Validators.required]],
      email: [{ value: personalProfileObj?.email, disabled: true }, [Validators.required]],
      mobile: [{ value: personalProfileObj?.mobile, disabled: true }, [Validators.required]],
      dob: [{ value: (preparedDOB && preparedDOB._d && preparedDOB._d != 'Invalid Date') ? preparedDOB._d : null, disabled: true }, [Validators.required]],
      city: [{ value: personalProfileObj?.city, disabled: true }, [Validators.required]],
      pincode: [{ value: personalProfileObj?.pincode, disabled: true }, [Validators.required, Validators.maxLength(6), Validators.pattern('^[0-9]+(\.?[0-9]+)?$')]],
      state: [{ value: personalProfileObj?.state, disabled: true }, [Validators.required]],
      country: [{ value: personalProfileObj?.country, disabled: true }, [Validators.required]],
      country_code: [{ value: personalProfileObj?.country_code, disabled: true }],
      about: [{ value: personalProfileObj?.about, disabled: true }]
    });
  }

  private _prepareBusinessForm(businessProfileObj: any = {}): void {
    const preparedDOB: any = moment(businessProfileObj?.dob, 'DD-MM-YYYY');
    this.businessForm = this._formBuilder.group({
      name: [{ value: businessProfileObj?.name, disabled: true }, [Validators.required]],
      email: [{ value: businessProfileObj?.email, disabled: true }, [Validators.required]],
      mobile: [{ value: businessProfileObj?.mobile, disabled: true }, [Validators.required]],
      address: [{ value: businessProfileObj?.address, disabled: true }, [Validators.required]],
      dob: [{ value: (preparedDOB && preparedDOB._d && preparedDOB._d != 'Invalid Date') ? preparedDOB._d : new Date(), disabled: true }, [Validators.required]],
      country: [{ value: businessProfileObj?.country, disabled: true }, [Validators.required]],
      about: [{ value: businessProfileObj?.about, disabled: true }]
    });
  }
}
