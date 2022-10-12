import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormControlName,Validators} from '@angular/forms';
import { values } from 'lodash';

import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  data: any;
  date3:Date=new Date()
  date4:Date=new Date()
  submit: boolean = false;
  submit1: boolean = false;
  imageSrc: any = '../assets/images/profile-3.png';
  imageSrc1: any = '../assets/images/profile-3.png';

  constructor() {}
  
  profileForm = new FormGroup({
    firstName: new FormControl(''),
    email: new FormControl(''),
    mobile: new FormControl(''),
    dob: new FormControl(''),
    city: new FormControl(''),
    pincode: new FormControl(''),
    state: new FormControl(''),
    country: new FormControl(''),
    about: new FormControl(''),
  });

  businessForm = new FormGroup({
    firstName1: new FormControl(''),
    email1: new FormControl(''),
    mobile1: new FormControl(''),
    address: new FormControl(''),
    dob1: new FormControl(''),
    country1: new FormControl(''),
    about1: new FormControl(''),
  });


  profile(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader: any = new FileReader();
      reader.onload = (e: any) => {
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
      reader.onload = (e: any) => {
        this.imageSrc1 = reader.result;
        // localStorage.setItem('pic', reader.result);
      };
      reader.readAsDataURL(file); 
    }
  }
  
  editProfile(){
    this.submit = true
  }
  editProfile1(){
    this.submit1 = true
  }

  changeProfile(){
    if (!this.profileForm.valid) {
      console.log('invalid')
      return;
    }else{
    console.log('profile');
    localStorage.setItem('mykey', JSON.stringify(this.profileForm.value));
    localStorage.setItem('pic', this.imageSrc);
    }
  }

  changeProfile1(){
    if (!this.businessForm.valid) {
      console.log('invalid')
      return;
    }else{
    // console.log('profile');
    localStorage.setItem('mykey1', JSON.stringify(this.businessForm.value));
    localStorage.setItem('pic1', this.imageSrc1);
    }
  }

  //   readURL(event:any): void {
  //     if (event.target.files && event.target.files[0]) {
  //         const file = event.target.files[0];
  //         const reader = new FileReader();

  //         reader.onload = e => this.imageSrc =reader.result;

  //         reader.readAsDataURL(file);
  //     }
  // }

  ngOnInit(): void {
    var a = JSON.parse(localStorage.getItem('mykey')!);
    var pic = localStorage.getItem('pic')!;
    if(pic==null){
   this.imageSrc
  }else{
    this.imageSrc=pic
  }
    var a1 = JSON.parse(localStorage.getItem('mykey1')!);
    console.log(a1.dob1)
    this.date3=new Date(a1.dob1)
    this.date4=new Date(a.dob)
    var pic1 = localStorage.getItem('pic1')!;
    if(pic1==null){
   this.imageSrc1
  }else{
    this.imageSrc1=pic1
  }

  this.profileForm = new FormGroup({
      firstName: new FormControl(a['firstName'],[Validators.required]),
      email: new FormControl(a['email']),
      mobile: new FormControl(a['mobile'],[Validators.required]),
      dob: new FormControl(a['dob'],[Validators.required]),
      city: new FormControl(a['city'],[Validators.required]),
      pincode: new FormControl(a['pincode'],[Validators.required, Validators.maxLength(6), Validators.pattern('^[0-9]+(\.?[0-9]+)?$')]),
      state: new FormControl(a['state'],[Validators.required]),
      country: new FormControl(a['country'],[Validators.required]),
      about: new FormControl(a['about'],[Validators.required]),
    });

   this.businessForm = new FormGroup({
      firstName1: new FormControl(a1['firstName1'],[Validators.required]),
      email1: new FormControl(a1['email1']),
      mobile1: new FormControl(a1['mobile1']),
      address: new FormControl(a1['address'],[Validators.required]),
      dob1: new FormControl(a1['dob1'],[Validators.required]),
      country1: new FormControl(a1['country1'],[Validators.required]),
      about1: new FormControl(a1['about1'],[Validators.required])
    });
  }



 get firstName(){
    // console.log(this.profileForm.get('firstName'));
    return this.profileForm.get('firstName')
  }

  get dob(){
    // console.log(this.profileForm.get('firstName'));
    return this.profileForm.get('dob')
  }
  get city(){
    // console.log(this.profileForm.get('firstName'));
    return this.profileForm.get('city')
  }
  get pincode(){
    // console.log(this.profileForm.get('firstName'));
    return this.profileForm.get('pincode')
  }
  get state(){
    // console.log(this.profileForm.get('firstName'));
    return this.profileForm.get('state')
  }
  get country(){
    // console.log(this.profileForm.get('firstName'));
    return this.profileForm.get('country')
  }
  get about(){
    // console.log(this.profileForm.get('firstName'));
    return this.profileForm.get('about')
  }

  get firstName1(){
    //console.log(this.profileForm.get('firstName'));
    return this.businessForm.get('firstName1')
  }
  
  get dob1(){
    // console.log(this.profileForm.get('firstName'));
    return this.businessForm.get('dob1')
  }
  get address(){
    // console.log(this.profileForm.get('firstName'));
    return this.businessForm.get('address')
  }
  get city1(){
    // console.log(this.profileForm.get('firstName'));
    return this.businessForm.get('city1')
  }
  
  get country1(){
    // console.log(this.profileForm.get('firstName'));
    return this.businessForm.get('country1')
  }
  get about1(){
    // console.log(this.profileForm.get('firstName'));
    return this.businessForm.get('about1')
  }
}
