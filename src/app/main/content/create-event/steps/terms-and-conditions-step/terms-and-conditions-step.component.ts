import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
// @ts-ignore
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { GlobalFunctions } from 'src/app/main/common/global-functions';
import { ModalService } from 'src/app/main/_modal';
import { GlobalService } from 'src/app/services/global.service';
import { CreateEventService } from '../../create-event.service';
declare let $: any;

@Component({
  selector: 'app-terms-and-conditions-step',
  templateUrl: './terms-and-conditions-step.component.html',
  styleUrls: ['./terms-and-conditions-step.component.scss']
})
export class TermsAndConditionsStepComponent implements OnInit {
  termsAndConditionsForm: any;
  isLoading: boolean = false;
  detailEditor = DecoupledEditor;
  editorConfig: any = {};
  agreeTAndC: boolean = false;

  eventRegister: any;

  @Input() eventObj: any = {};

  termsAndConditionsObj: any = { terms_and_conditions: {} };

  constructor(
    private _formBuilder: FormBuilder,
    private _modalService: ModalService,
    private _router: Router,
    private _createEventService: CreateEventService,
    private _globalFunctions: GlobalFunctions,
    private _globalService: GlobalService,
  ) { }

  ngOnInit(): void {
    if (localStorage.getItem('newEventObj')) {
      const eventString: any = localStorage.getItem('newEventObj');
      this.termsAndConditionsObj = JSON.parse(eventString);
    } else {
      this._router.navigate(['/events']);
    }
    this.editorConfig = {
      toolbar: [
        'heading', '|',
        'fontsize', 'fontfamily', '|',
        'fontColor', 'fontBackgroundColor', '|',
        'bold', 'italic', 'underline', 'strikethrough', '|',
        'alignment', '|',
        'outdent', 'indent', '|',
        'numberedList', 'bulletedList', '|',
        'link', 'mediaembed', 'blockquote', 'insertTable', '|',
        'undo', 'redo'
      ],
      mediaEmbed: { previewsInData: true },
      table: { contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'] },
      language: 'en',
      alignment: { options: ['left', 'right', 'center', 'justify'] },
      fontSize: { options: ['tiny', 'small', 'default', 'big', 'huge'] },
      fontColor: {
        columns: 6,
        colors: [
          { color: '#f05a28', label: 'Theme Orange', class: 'orange' },
          { color: 'hsl(0, 0%, 0%)', label: 'Black' },
          { color: 'hsl(0, 0%, 30%)', label: 'Dim grey' },
          { color: 'hsl(0, 0%, 60%)', label: 'Grey' },
          { color: 'hsl(0, 0%, 90%)', label: 'Light grey' },
          { color: 'hsl(0, 0%, 100%)', label: 'White', hasBorder: true },
          { color: '#f8696b', label: 'Red 1' },
          { color: '#FFD800', label: 'Yellow 1' },
          { color: '#63be7b', label: 'Green 1' },
          { color: '#f44336', label: 'Red 2' },
          { color: '#ff9100', label: 'Yellow 2' },
          { color: '#4caf50', label: 'Green 2' },
          { color: 'hsl(0, 75%, 60%)', label: 'Red' },
          { color: 'hsl(30, 75%, 60%)', label: 'Orange' },
          { color: 'hsl(60, 75%, 60%)', label: 'Yellow' },
          { color: 'hsl(90, 75%, 60%)', label: 'Light green' },
          { color: 'hsl(120, 75%, 60%)', label: 'Green' },
          { color: 'hsl(150, 75%, 60%)', label: 'Aquamarine' },
          { color: 'hsl(180, 75%, 60%)', label: 'Turquoise' },
          { color: 'hsl(210, 75%, 60%)', label: 'Light blue' },
          { color: 'hsl(240, 75%, 60%)', label: 'Blue' },
          { color: 'hsl(270, 75%, 60%)', label: 'Purple' }
        ]
      },
      fontBackgroundColor: {
        columns: 6,
        colors: [
          { color: '#f05a28', label: 'Theme Orange' },
          { color: 'hsl(0, 0%, 0%)', label: 'Black' },
          { color: 'hsl(0, 0%, 30%)', label: 'Dim grey' },
          { color: 'hsl(0, 0%, 60%)', label: 'Grey' },
          { color: 'hsl(0, 0%, 90%)', label: 'Light grey' },
          { color: 'hsl(0, 0%, 100%)', label: 'White', hasBorder: true },
          { color: '#f8696b', label: 'Red 1' },
          { color: '#FFD800', label: 'Yellow 1' },
          { color: '#63be7b', label: 'Green 1' },
          { color: '#f44336', label: 'Red 2' },
          { color: '#ff9100', label: 'Yellow 2' },
          { color: '#4caf50', label: 'Green 2' },
          { color: 'hsl(0, 75%, 60%)', label: 'Red' },
          { color: 'hsl(30, 75%, 60%)', label: 'Orange' },
          { color: 'hsl(60, 75%, 60%)', label: 'Yellow' },
          { color: 'hsl(90, 75%, 60%)', label: 'Light green' },
          { color: 'hsl(120, 75%, 60%)', label: 'Green' },
          { color: 'hsl(150, 75%, 60%)', label: 'Aquamarine' },
          { color: 'hsl(180, 75%, 60%)', label: 'Turquoise' },
          { color: 'hsl(210, 75%, 60%)', label: 'Light blue' },
          { color: 'hsl(240, 75%, 60%)', label: 'Blue' },
          { color: 'hsl(270, 75%, 60%)', label: 'Purple' }
        ]
      }
    };
    this._prepareForm(this.eventObj);
    // this.prepareTermsAndConditionsEventObj();

    this.termsAndConditionsForm.get('terms_and_conditions').setValue(false);
    // this.eventObj = {
    //   "add_event": {
    //     "id": 183,
    //     "name": "Bappu Event",
    //     "event_type": "B2B",
    //     "event_category": "VIP Event",
    //     "is_other": false,
    //     "user": 68,
    //     "is_active": true
    //   },
    //   "about_event": {
    //     "event_start_date": "2022-10-24",
    //     "event_end_date": "2022-10-26",
    //     "event_start_time": "15:47",
    //     "event_end_time": "17:47",
    //     "about_event": "Diwali Event"
    //   },
    //   "arrangements": [
    //     {
    //       "seat_id": 1,
    //       "seat": {
    //         "id": 1,
    //         "name": "Chair",
    //         "svg": "/media/image/events/seating_arrangement/chair.svg",
    //         "timestamp": "2021-08-15T06:22:41.229676Z",
    //         "sequence": 1,
    //         "is_active": true,
    //         "arrangement": [
    //           {
    //             "id": 1,
    //             "name": "Best Chair",
    //             "no_of_seat": 50,
    //             "seat_location": "FRONT",
    //             "seat_side": "LEFT",
    //             "table_person_capacity": 12,
    //             "person_capacity": 1,
    //             "table_price": 250,
    //             "price_per_seat": "350.50",
    //             "total_booking_count": 6,
    //             "description": "this is logn description for seat",
    //             "booking_acceptance": "",
    //             "seat_food": "VEG",
    //             "seat_food_description": "this is logn description for Food",
    //             "seat_equipment": true,
    //             "seat_equipment_description": "this is logn description for equipment",
    //             "seat": 1,
    //             "occasion": 43
    //           },
    //           {
    //             "id": 2,
    //             "name": "Good Chair",
    //             "no_of_seat": 100,
    //             "seat_location": "CENTER",
    //             "seat_side": "CENTER",
    //             "table_person_capacity": 12,
    //             "person_capacity": 1,
    //             "table_price": 250,
    //             "price_per_seat": "250.50",
    //             "total_booking_count": 12,
    //             "description": "this is logn description for seat",
    //             "booking_acceptance": "",
    //             "seat_food": "VEG",
    //             "seat_food_description": "this is logn description for Food",
    //             "seat_equipment": true,
    //             "seat_equipment_description": "this is logn description for equipment",
    //             "seat": 1,
    //             "occasion": 43
    //           },
    //           {
    //             "id": 3,
    //             "name": "Economic Chair",
    //             "no_of_seat": 200,
    //             "seat_location": "LAST",
    //             "seat_side": "RIGHT",
    //             "table_person_capacity": 12,
    //             "person_capacity": 1,
    //             "table_price": 250,
    //             "price_per_seat": "150.50",
    //             "total_booking_count": 30,
    //             "description": "this is logn description for seat",
    //             "booking_acceptance": "",
    //             "seat_food": "VEG",
    //             "seat_food_description": "this is logn description for Food",
    //             "seat_equipment": true,
    //             "seat_equipment_description": "this is logn description for equipment",
    //             "seat": 1,
    //             "occasion": 43
    //           },
    //           {
    //             "id": 5,
    //             "name": "Economic Chair",
    //             "no_of_seat": 200,
    //             "seat_location": "LAST",
    //             "seat_side": "RIGHT",
    //             "table_person_capacity": 12,
    //             "person_capacity": 1,
    //             "table_price": 250,
    //             "price_per_seat": "150.50",
    //             "total_booking_count": null,
    //             "description": "this is logn description for seat",
    //             "booking_acceptance": "",
    //             "seat_food": "VEG",
    //             "seat_food_description": "this is logn description for Food",
    //             "seat_equipment": true,
    //             "seat_equipment_description": "this is logn description for equipment",
    //             "seat": 1,
    //             "occasion": 43
    //           },
    //           {
    //             "id": 6,
    //             "name": "Economic Chair",
    //             "no_of_seat": 200,
    //             "seat_location": "LAST",
    //             "seat_side": "RIGHT",
    //             "table_person_capacity": 12,
    //             "person_capacity": 1,
    //             "table_price": 250,
    //             "price_per_seat": "150.50",
    //             "total_booking_count": null,
    //             "description": "this is logn description for seat",
    //             "booking_acceptance": "",
    //             "seat_food": "VEG",
    //             "seat_food_description": "this is logn description for Food",
    //             "seat_equipment": true,
    //             "seat_equipment_description": "this is logn description for equipment",
    //             "seat": 1,
    //             "occasion": 43
    //           },
    //           {
    //             "id": 7,
    //             "name": "demo",
    //             "no_of_seat": 2,
    //             "seat_location": "TOP",
    //             "seat_side": "LEFT",
    //             "table_person_capacity": 4,
    //             "person_capacity": 4,
    //             "table_price": 200,
    //             "price_per_seat": "50.00",
    //             "total_booking_count": 10,
    //             "description": "demo",
    //             "booking_acceptance": "PERTABLE",
    //             "seat_food": "BOTH",
    //             "seat_food_description": "both food description",
    //             "seat_equipment": true,
    //             "seat_equipment_description": "equipment description",
    //             "seat": 1,
    //             "occasion": 43
    //           },
    //           {
    //             "id": 8,
    //             "name": "demo",
    //             "no_of_seat": 2,
    //             "seat_location": "TOP",
    //             "seat_side": "LEFT",
    //             "table_person_capacity": 4,
    //             "person_capacity": 4,
    //             "table_price": 200,
    //             "price_per_seat": "50.00",
    //             "total_booking_count": 10,
    //             "description": "demo",
    //             "booking_acceptance": "PERTABLE",
    //             "seat_food": "BOTH",
    //             "seat_food_description": "both food description",
    //             "seat_equipment": true,
    //             "seat_equipment_description": "equipment description",
    //             "seat": 1,
    //             "occasion": 48
    //           },
    //           {
    //             "id": 9,
    //             "name": "Chair",
    //             "no_of_seat": 1,
    //             "seat_location": "TOP",
    //             "seat_side": "CENTER",
    //             "table_person_capacity": null,
    //             "person_capacity": 1,
    //             "table_price": null,
    //             "price_per_seat": "1.00",
    //             "total_booking_count": null,
    //             "description": "test",
    //             "booking_acceptance": "PERTABLE",
    //             "seat_food": "NONE",
    //             "seat_food_description": "",
    //             "seat_equipment": false,
    //             "seat_equipment_description": "",
    //             "seat": 1,
    //             "occasion": 55
    //           },
    //           {
    //             "id": 10,
    //             "name": "Chair",
    //             "no_of_seat": 11,
    //             "seat_location": "CENTER",
    //             "seat_side": "LEFT",
    //             "table_person_capacity": null,
    //             "person_capacity": 11,
    //             "table_price": null,
    //             "price_per_seat": "111.00",
    //             "total_booking_count": null,
    //             "description": "Test",
    //             "booking_acceptance": "PERTABLE",
    //             "seat_food": "NONE",
    //             "seat_food_description": "",
    //             "seat_equipment": false,
    //             "seat_equipment_description": "",
    //             "seat": 1,
    //             "occasion": 65
    //           },
    //           {
    //             "id": 11,
    //             "name": "demo",
    //             "no_of_seat": 5,
    //             "seat_location": "CENTER",
    //             "seat_side": "RIGHT",
    //             "table_person_capacity": 1,
    //             "person_capacity": 1,
    //             "table_price": 1,
    //             "price_per_seat": "50.00",
    //             "total_booking_count": 1,
    //             "description": "demo",
    //             "booking_acceptance": "PERTABLE",
    //             "seat_food": "NONVEG",
    //             "seat_food_description": "demo",
    //             "seat_equipment": true,
    //             "seat_equipment_description": "dewmo",
    //             "seat": 1,
    //             "occasion": 29
    //           },
    //           {
    //             "id": 12,
    //             "name": "demo",
    //             "no_of_seat": 2,
    //             "seat_location": "TOP",
    //             "seat_side": "LEFT",
    //             "table_person_capacity": 4,
    //             "person_capacity": 4,
    //             "table_price": 200,
    //             "price_per_seat": "50.00",
    //             "total_booking_count": 10,
    //             "description": "demo",
    //             "booking_acceptance": "PERTABLE",
    //             "seat_food": "BOTH",
    //             "seat_food_description": "both food description",
    //             "seat_equipment": true,
    //             "seat_equipment_description": "equipment description",
    //             "seat": 1,
    //             "occasion": 48
    //           },
    //           {
    //             "id": 13,
    //             "name": "Chair",
    //             "no_of_seat": 10,
    //             "seat_location": "TOP",
    //             "seat_side": "RIGHT",
    //             "table_person_capacity": null,
    //             "person_capacity": 10,
    //             "table_price": null,
    //             "price_per_seat": "1.00",
    //             "total_booking_count": null,
    //             "description": "Chair for all Garba player",
    //             "booking_acceptance": "PERTABLE",
    //             "seat_food": "VEG",
    //             "seat_food_description": "Food For alll",
    //             "seat_equipment": true,
    //             "seat_equipment_description": "We provided dandies to all",
    //             "seat": 1,
    //             "occasion": 66
    //           },
    //           {
    //             "id": 16,
    //             "name": "Chair",
    //             "no_of_seat": 11,
    //             "seat_location": "CENTER",
    //             "seat_side": "LEFT",
    //             "table_person_capacity": null,
    //             "person_capacity": 1,
    //             "table_price": null,
    //             "price_per_seat": "1000.00",
    //             "total_booking_count": null,
    //             "description": "Test",
    //             "booking_acceptance": "PERTABLE",
    //             "seat_food": "VEG",
    //             "seat_food_description": "Veg Food",
    //             "seat_equipment": true,
    //             "seat_equipment_description": "Dandiya",
    //             "seat": 1,
    //             "occasion": 67
    //           },
    //           {
    //             "id": 18,
    //             "name": "Chair",
    //             "no_of_seat": 11,
    //             "seat_location": "CENTER",
    //             "seat_side": "LEFT",
    //             "table_person_capacity": null,
    //             "person_capacity": 11,
    //             "table_price": null,
    //             "price_per_seat": "11.00",
    //             "total_booking_count": null,
    //             "description": "Test chair",
    //             "booking_acceptance": "PERTABLE",
    //             "seat_food": "NONE",
    //             "seat_food_description": "",
    //             "seat_equipment": false,
    //             "seat_equipment_description": "",
    //             "seat": 1,
    //             "occasion": 68
    //           },
    //           {
    //             "id": 20,
    //             "name": "Chair",
    //             "no_of_seat": 100,
    //             "seat_location": "TOP",
    //             "seat_side": "LEFT",
    //             "table_person_capacity": null,
    //             "person_capacity": 100,
    //             "table_price": null,
    //             "price_per_seat": "5.00",
    //             "total_booking_count": null,
    //             "description": "Chair fr all employee",
    //             "booking_acceptance": "PERTABLE",
    //             "seat_food": "VEG",
    //             "seat_food_description": "Drinks and dinner fo all",
    //             "seat_equipment": false,
    //             "seat_equipment_description": "",
    //             "seat": 1,
    //             "occasion": 69
    //           },
    //           {
    //             "id": 21,
    //             "name": "Chair",
    //             "no_of_seat": 1,
    //             "seat_location": "CENTER",
    //             "seat_side": "LEFT",
    //             "table_person_capacity": null,
    //             "person_capacity": 1,
    //             "table_price": null,
    //             "price_per_seat": "1.00",
    //             "total_booking_count": null,
    //             "description": "Test111",
    //             "booking_acceptance": "PERTABLE",
    //             "seat_food": "NONE",
    //             "seat_food_description": "",
    //             "seat_equipment": false,
    //             "seat_equipment_description": "",
    //             "seat": 1,
    //             "occasion": 70
    //           },
    //           {
    //             "id": 22,
    //             "name": "Chair",
    //             "no_of_seat": 100,
    //             "seat_location": "CENTER",
    //             "seat_side": "LEFT",
    //             "table_person_capacity": null,
    //             "person_capacity": 100,
    //             "table_price": null,
    //             "price_per_seat": "10.00",
    //             "total_booking_count": null,
    //             "description": "Chair for all my friens",
    //             "booking_acceptance": "PERTABLE",
    //             "seat_food": "NONE",
    //             "seat_food_description": "",
    //             "seat_equipment": false,
    //             "seat_equipment_description": "",
    //             "seat": 1,
    //             "occasion": 71
    //           },
    //           {
    //             "id": 23,
    //             "name": "Chair",
    //             "no_of_seat": 1000,
    //             "seat_location": "CENTER",
    //             "seat_side": "LEFT",
    //             "table_person_capacity": null,
    //             "person_capacity": 10,
    //             "table_price": null,
    //             "price_per_seat": "10.00",
    //             "total_booking_count": null,
    //             "description": "Chair for all users",
    //             "booking_acceptance": "PERTABLE",
    //             "seat_food": "NONE",
    //             "seat_food_description": "",
    //             "seat_equipment": false,
    //             "seat_equipment_description": "",
    //             "seat": 1,
    //             "occasion": 73
    //           }
    //         ]
    //       },
    //       "name": "",
    //       "no_of_seat": 1,
    //       "seat_location": "CENTER",
    //       "seat_side": "RIGHT",
    //       "table_person_capacity": 0,
    //       "person_capacity": 1,
    //       "table_price": 0,
    //       "price_per_seat": 0,
    //       "total_booking_count": 0,
    //       "description": "Free",
    //       "seat_food": "VEG",
    //       "seat_food_description": "sdfsdf",
    //       "seat_equipment_description": "sdfsdfsdf",
    //       "booking_acceptance": "PERTABLE",
    //       "seat_equipment": false
    //     }
    //   ],
    //   "event_location": {
    //     "flat_number": "40",
    //     "street_name": "Khodalchhaya society",
    //     "area_name": "Mota Varachha",
    //     "latitude": 21.235521409762793,
    //     "longitude": 72.88234739150393,
    //     "city": "Surat",
    //     "state": "Gujarat",
    //     "pincode": "394101"
    //   },
    //   "photos_and_videos": {
    //     "poster": {},
    //     "photos": [
    //       {
    //         "image": {},
    //         "details": "Image 1",
    //         "name": "woman-1063100 (1).jpg"
    //       },
    //       {
    //         "image": {},
    //         "details": "Image 2",
    //         "name": "example_clipdrop-relight.jpeg"
    //       }
    //     ],
    //     "videos": [
    //       {
    //         "video": {},
    //         "details": "Demo video"
    //       }
    //     ]
    //   },
    //   "permission": {
    //     "permission_letter": {},
    //     "accept_booking": true,
    //     "permission_letter_name": "ScaleLot_Standard Operating Procedure.pdf"
    //   },
    //   "discounts": [
    //     41
    //   ],
    //   "company_details": {
    //     "company_detail": {
    //       "name": "Scalelot Tach",
    //       "gst": {},
    //       "contact_no": "9874563210",
    //       "email": "sdfsdf@fcxgdfg.ser",
    //       "about": "SADdfrsd Enjoi",
    //       "flat_no": "20",
    //       "street": "dfgdsfg",
    //       "area": "Katargam",
    //       "city": "sdfsdf",
    //       "state": "sdfsdfsdf",
    //       "pincode": "123456",
    //       "event_reg": null,
    //       "gst_name": "ScaleLot_Standard Operating Procedure.pdf"
    //     },
    //     "company_images": [
    //       {
    //         "image": {}
    //       }
    //     ],
    //     "company_videos": [
    //       {
    //         "video": {}
    //       }
    //     ]
    //   },
    //   "personal_details": {
    //     "full_name": "Sahil Nayani",
    //     "mobile": "9909682980",
    //     "mobile_hidden": false,
    //     "alternate_mobile": "9909682980",
    //     "alternate_mobile_hidden": true,
    //     "email": "sdfsdf@fcxgdfg.ser",
    //     "email_hidden": false,
    //     "flat_number": "20",
    //     "street_name": "dfgdsfg",
    //     "area_name": "Katargam",
    //     "state": "sdfsdfsdf",
    //     "city": "sdfsdf",
    //     "pincode": "123456"
    //   },
    //   "terms_and_conditions": {
    //     "event_terms_and_conditions": "<h3><strong>Bappu no ek j niyam</strong></h3><p>&nbsp;</p><p>Roke ani mane thoke</p><p>&nbsp;</p><p>Bhag B</p>",
    //     "facebook_url": "Bappu",
    //     "youtube_url": "Bappu",
    //     "twitter_url": "Bappu",
    //     "pinterest_url": "Bappu",
    //     "instagram_url": "Bappu",
    //     "linkedin_url": "Bappu",
    //     "terms_and_conditions": true
    //   }
    // };
  }

  onTextEditorReady(editor: any, fieldForSetData: any): void {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  tAndCPop(): void {
    if (this.termsAndConditionsForm.value && this.termsAndConditionsForm.value.terms_and_conditions == false) {
      this.termsAndConditionsForm.get('terms_and_conditions').setValue(false);
      this._modalService.open("tandc");
    }
  }

  closePop(): any {
    this.termsAndConditionsForm.get('terms_and_conditions').setValue(false);
    this._modalService.close("tandc");
  }

  applyTAndC(): void {
    this.termsAndConditionsForm.get('terms_and_conditions').setValue(true);
    this._modalService.close("tandc");
  }

  saveFullEvent(): void {
    if (this.termsAndConditionsForm.invalid) {
      Object.keys(this.termsAndConditionsForm.controls).forEach((key) => {
        this.termsAndConditionsForm.controls[key].touched = true;
        this.termsAndConditionsForm.controls[key].markAsDirty();
      });
      return;
    }
    this.termsAndConditionsObj = this.prepareObj(this.termsAndConditionsForm.value);
    // console.log(this.termsAndConditionsObj);
    
    this.eventRegister = this.prepareEventObj(this.eventObj);
    this.eventApiCall(this.eventRegister);

    // const preparedEventImagesObj: any = this.prepareImagesEventObj(this.termsAndConditionsObj);
    // console.log(preparedEventImagesObj);

    // this.termsAndConditionsObj?.photos_and_videos.photo.forEach((photo: any) => {
    //   const preparedEventImagesObj: any = photo;
    //   preparedEventImagesObj.description = photo.details;
    // });
    // this.termsAndConditionsObj?.photos_and_videos.video.forEach((video: any) => {
    //   const preparedEventImagesObj: any = video;
    //   preparedEventImagesObj.description = video.details;
    //   console.log(preparedEventImagesObj);
    // });
  }

  eventApiCall(eventRegister: any): any {
    this.isLoading = true;
    const preparedAddEventObj: any = this.prepareAddEventObj(eventRegister);
    this._createEventService.eventRegister(preparedAddEventObj).subscribe((result: any) => {
      if (result && result.status) {
        console.log(result);
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
      }
      this.isLoading = false;
    }, (error: any) => {
      this.isLoading = false;
      console.log(error);
      this._globalFunctions.errorHanding(error, this, true);
    });
  }

  prepareAddEventObj(eventRegisterObj: any): any {
    const eventRegisterObjDataObj = new FormData();
    $.each(eventRegisterObj, function (field: any, value: any) {
      // if (field !== 'poster') {
        eventRegisterObjDataObj.append(field, value);
      // }
    });
    
    // const profile_pic = $('input[id=profile_pic]')[0].files[0];
    // if (profile_pic !== undefined) {
    //   eventRegisterObjDataObj.append('poster', profile_pic);
    // }

    return eventRegisterObjDataObj;
  }

  prepareEventObj(eventObj: any = {}): any {
    const preparedEventObj: any = {};
    const newEventObj: any = localStorage.getItem('newEventObj');
    const eventId = JSON.parse(newEventObj).add_event.id;
    preparedEventObj.event = eventId;

    const aboutEventObj: any = eventObj?.about_event;
    preparedEventObj.start_date = aboutEventObj?.event_start_date;
    preparedEventObj.end_date = aboutEventObj?.event_end_date;
    preparedEventObj.start_time = aboutEventObj?.event_start_time;
    preparedEventObj.end_time = aboutEventObj?.event_end_time;
    preparedEventObj.description = aboutEventObj?.about_event;

    const locationEventObj: any = eventObj?.event_location;
    preparedEventObj.flat_no = locationEventObj?.flat_number;
    preparedEventObj.street_name = locationEventObj?.street_name;
    preparedEventObj.area_name = locationEventObj?.area_name;
    // 
    preparedEventObj.location_address = locationEventObj?.city + ' ' + locationEventObj?.state;
    preparedEventObj.address = locationEventObj?.city + ' ' + locationEventObj?.state;
    // 
    preparedEventObj.city = locationEventObj?.city;
    preparedEventObj.state = locationEventObj?.state;
    preparedEventObj.pincode = locationEventObj?.pincode;
    preparedEventObj.longitude = locationEventObj?.longitude;
    preparedEventObj.latitude = locationEventObj?.latitude;

    const permissionLetterEventObj: any = eventObj?.permission;
    preparedEventObj.permission_letter = permissionLetterEventObj?.permission_letter;
    preparedEventObj.accept_booking = permissionLetterEventObj?.accept_booking;

    const posterEventObj: any = eventObj?.photos_and_videos;
    preparedEventObj.poster = posterEventObj?.poster;

    preparedEventObj.capacity = "400";
    preparedEventObj.location_type = "Google map";
    preparedEventObj.occupancy_type = "Occupancy Type";
    preparedEventObj.status = "SUBMIT";
    preparedEventObj.is_verify = true;
    preparedEventObj.is_active = true;
    preparedEventObj.live = true;

    const permissionEventObj: any = eventObj?.event_permission;
    preparedEventObj.permission_letter = permissionEventObj?.permission_letter;
    preparedEventObj.accept_booking = permissionEventObj?.accept_booking;

    const tAndCEventObj: any = this.termsAndConditionsObj;
    preparedEventObj.t_and_c = tAndCEventObj?.event_terms_and_conditions;
    preparedEventObj.facebook = tAndCEventObj?.facebook_url;
    preparedEventObj.instagram = tAndCEventObj?.instagram_url;
    preparedEventObj.linkedin = tAndCEventObj?.linkedin_url;
    preparedEventObj.pinterest = tAndCEventObj?.pinterest_url;
    preparedEventObj.twitter = tAndCEventObj?.twitter_url;
    preparedEventObj.youtube = tAndCEventObj?.youtube_url;

    return preparedEventObj;
  }

  prepareEventImageObj(eventObj: any = {}): any {
    const preparedEventObj: any = {};

    const aboutEventObj: any = eventObj?.about_event;
    preparedEventObj.start_date = aboutEventObj?.event_start_date;
  }

  // prepareTermsAndConditionsEventObj(): void {
  //   this._globalService.addEditEvent$.subscribe((eventObj: any) => {
  //     if (eventObj) {
  //       this.eventObj = eventObj;
  //       this._prepareForm(this.eventObj);
  //     }
  //   });
  //   if (!this.eventObj || !this.eventObj.add_event) {
  //   }
  // }

  prepareImagesEventObj(eventObj: any = {}): any {
  }

  prepareObj(companyObj: any = {}): any {
    const preparedObj: any = companyObj;
    return preparedObj;
  }

  private _prepareForm(eventObj: any = {}): void {
    this.termsAndConditionsForm = this._formBuilder.group({
      event_terms_and_conditions: [eventObj?.terms_and_conditions?.event_terms_and_conditions, [Validators.required]],
      facebook_url: [eventObj?.terms_and_conditions?.facebook_url],
      youtube_url: [eventObj?.terms_and_conditions?.youtube_url],
      twitter_url: [eventObj?.terms_and_conditions?.twitter_url],
      pinterest_url: [eventObj?.terms_and_conditions?.pinterest_url],
      instagram_url: [eventObj?.terms_and_conditions?.instagram_url],
      linkedin_url: [eventObj?.terms_and_conditions?.linkedin_url],
      terms_and_conditions: [eventObj?.terms_and_conditions?.terms_and_conditions, { disabled: true }],
    });
  }
}
