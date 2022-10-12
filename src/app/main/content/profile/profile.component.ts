import {Component, OnInit} from '@angular/core';
import {Validators, FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  submit: boolean = false;
  submit1: boolean = false;
  // isEditProfile: boolean = false;
  // isEditBusinessProfile: boolean = false;
  imageSrc: any = '../assets/images/profile-3.png';
  imageSrc1: any = '../assets/images/profile-3.png';
  profileForm: any;
  businessForm: any;
  profileObj: any = {};
  businessObj: any = {};

  constructor(private _formBuilder: FormBuilder) {
  }


  ngOnInit(): void {
    this._prepareProfileForm();
    this._prepareBusinessForm();

    if (localStorage.getItem('mykey')) {
      this.profileObj = JSON.parse(<string>localStorage.getItem('mykey'));
    }
    if (localStorage.getItem('pic')) {
      this.imageSrc = localStorage.getItem('pic');
    }
    this.businessObj = JSON.parse(<string>localStorage.getItem('mykey1'));
    if (localStorage.getItem('pic1')) {
      this.imageSrc1 = localStorage.getItem('pic1')
    }
  }

  profile(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader: any = new FileReader();
      reader.onload = () => {
        this.imageSrc = reader.result;
        // localStorage.setItem('pic', reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  profile1(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader: any = new FileReader();
      reader.onload = () => {
        this.imageSrc1 = reader.result;
        // localStorage.setItem('pic', reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  editProfile() {
    this.submit = true
  }

  editProfile1() {
    this.submit1 = true
  }

  changeProfile() {
    if (!this.profileForm.valid) {
      console.log('invalid');
      return;
    } else {
      console.log('profile');
      localStorage.setItem('mykey', JSON.stringify(this.profileForm.value));
      localStorage.setItem('pic', this.imageSrc);
    }
  }

  changeProfile1() {
    if (!this.businessForm.valid) {
      console.log('invalid');
      return;
    } else {
      // console.log('profile');
      localStorage.setItem('mykey1', JSON.stringify(this.businessForm.value));
      localStorage.setItem('pic1', this.imageSrc1);
    }
  }


  get profileFirstName() {
    return this.profileForm.get('firstName')
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
    return this.businessForm.get('firstName')
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

  private _prepareProfileForm(): void {
    this.profileForm = this._formBuilder.group({
      firstName: [this.profileObj?.firstName, [Validators.required]],
      email: [this.profileObj?.email, [Validators.required]],
      mobile: [this.profileObj?.mobile, [Validators.required]],
      dob: [this.profileObj.dob ? new Date(this.profileObj.dob) : new Date(), [Validators.required]],
      city: [this.profileObj?.city, [Validators.required]],
      pincode: [this.profileObj?.pincode, [Validators.required, Validators.maxLength(6), Validators.pattern('^[0-9]+(\.?[0-9]+)?$')]],
      state: [this.profileObj?.state, [Validators.required]],
      country: [this.profileObj?.country, [Validators.required]],
      about: [this.profileObj?.about]
    });
  }

  private _prepareBusinessForm(): void {
    this.businessForm = this._formBuilder.group({
      firstName: [this.businessObj?.firstName, [Validators.required]],
      email: [this.businessObj?.email, [Validators.required]],
      mobile: [this.businessObj?.mobile, [Validators.required]],
      address: [this.businessObj?.address, [Validators.required]],
      dob: [this.businessObj.dob ? new Date(this.businessObj.dob) : new Date(), [Validators.required]],
      country: [this.businessObj?.country, [Validators.required]],
      about: [this.businessObj?.about]
    });
  }
}
