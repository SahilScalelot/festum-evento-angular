import { Component, EventEmitter, Input, OnInit, Output,ViewChild } from '@angular/core';
import { CONSTANTS } from 'src/app/main/common/constants';
import { FormArray, FormBuilder, Validators } from "@angular/forms";
import * as _ from 'lodash';
// @ts-ignore
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { SnotifyService } from "ng-snotify";
import { GlobalFunctions } from 'src/app/main/common/global-functions';
import { CreateEventService } from '../../../create-event.service';
import { ModalService } from 'src/app/main/_modal';

import { forkJoin, merge, Observable, take } from 'rxjs';

@Component({
  selector: 'app-arrangement-dialog',
  templateUrl: './arrangement-dialog.component.html',
  styleUrls: ['./arrangement-dialog.component.scss']
})
export class ArrangementDialogComponent implements OnInit {
  @ViewChild('photosNgForm') photosNgForm: any;

  constants: any = CONSTANTS;
  seatingForm: any;
  seatingLocationIcon: any;
  selectedTab = 0;
  totalArrangementsObj: any = {};
  selectedSeatingObj: any = {};
  isInitial: boolean = true;
  isLoading: boolean = false;
  eventId: any;
  addEditEvent: any;
  food_included_in_ticket_price: any ;
  tempFoodNotIncluded:boolean=true;

  tempFoodSec:any;
  tempFoodSecNum:any;
  
  detailEditor = DecoupledEditor;
  editorConfig: any = {};
  textEditorFood: boolean = false;
  textEditorEquipment: boolean = false;
  textEditorMaxLimit: any = this.constants.CKEditorCharacterLimit0;
  textEditorLimitFood: any = this.textEditorMaxLimit;
  textEditorLimitEquipment: any = this.textEditorMaxLimit;

  // Photo Upload
  photoForm:any=[];
  deleteItemObj: any = {};
  isDeleteLoading: boolean = false;
  
  isPhotoLoading: boolean = false;

  inputText: any;
  drEvent: any;
  rejectedPhotosList: any;
  imagesFiles: File[] = [];
  videosUploadLimit: number = 2;
  rejectedVideosList: any;
  videosFiles: File[] = [];
  descriptionLimit: any = 0;

  posterImageAndVideoObj: any = {};
  
  photosUploadLimit: number = 5;

  isOpenPopup: boolean = false;

  isSingleVideo: boolean = false;
  companyIAndV: boolean = false;
  isImage: boolean = false;
  imagesOrVideosArr: Array<any> = [];
  tempImgArr:any [] = [];
  etempImgArr:any [] = [];

  @Input() arrangementsArr: any = {};
  @Input() popClass: any;
  @Input() seatingItems: any;
  @Input() editArrangementObj: any;
  @Output() isAddEventChange = new EventEmitter<boolean>();
  @Output() addEditArrangement: EventEmitter<any> = new EventEmitter();

  constructor(
    private _createEventService: CreateEventService,
    private _formBuilder: FormBuilder,
    private _sNotify: SnotifyService,
    private _globalFunctions: GlobalFunctions,
    private _modalService: ModalService,
  ) {
    
  }

  ngOnInit(): void {    
      _.each(this.editArrangementObj.food_details, (result)=>{
          this.tempImgArr.push(result);
        }) 
     
      _.each(this.editArrangementObj.equipment_details, (result)=>{
          this.etempImgArr.push(result);
        }) 
    

    this.isInitial = true;
    this._prepareArrangementForm();
    this.prepareSeatingItems();
    if (this.editArrangementObj && this.editArrangementObj.seating_item) {
      this.selectedSeatingObj = this.editArrangementObj.seating_item;
    }
    if(this.editArrangementObj.food_included_in_ticket_price == true){
      this.btnclick(1);
    }else if(this.editArrangementObj.food_included_in_ticket_price == false){
      this.btnclick(2);
    }

    if (localStorage.getItem('eId')) {
      this.eventId = localStorage.getItem('eId');
      this.posterImageAndVideoObj = { eventid: this.eventId, photos: []}
      // this.getArrangements();
    }

    this.photoForm = this._formBuilder.group({
      image: [null],
      imageName: [''],
      description: [null]
    });
  }

  validateTextEditor(): void {
    if (this.textEditorLimitFood && this.textEditorMaxLimit && this.textEditorLimitFood > this.textEditorMaxLimit) {
      return;
    }    
      this.seatingForm.get('food_details').setValue(this.tempImgArr);
   
      this.seatingForm.get('equipment_details').setValue(this.etempImgArr);
    
    this.selectedTab = 2;
  }

  btnclick(params:number){
    this.tempFoodSecNum=params;
    if(this.tempFoodSecNum == 1){
      this.tempFoodSec = false;
    } else if(this.tempFoodSecNum == 2){
      this.tempFoodSec = true;
    }
  }

  openImageAndVideoDialog(imagesOrVideosArr: Array<any>, isImage: boolean, companyIAndV: boolean): void {
    this.imagesOrVideosArr = imagesOrVideosArr;
    this.isImage = isImage;
    this.companyIAndV = companyIAndV;
    this.isOpenPopup = true;
  }

  openUploadPhotoDialog(): void {
    this.descriptionLimit = 0;
    this.photosNgForm.resetForm();
    if (this.selectedTab == 1) {
      if (this.tempImgArr && this.tempImgArr.length && this.tempImgArr.length >= this.photosUploadLimit) {
        this._sNotify.error('Maximum 5 images can upload!', 'Oops!');
      } else {
        this._modalService.open('photo');
      }
    }
    if (this.selectedTab == 2) {
      if (this.etempImgArr && this.etempImgArr.length && this.etempImgArr.length >= this.photosUploadLimit) {
        this._sNotify.error('Maximum 5 images can upload!', 'Oops!');
      } else {
        this._modalService.open('photo');
      }
    }
  }

  removeImage(index: number) {
    // this.photoArr.splice(index, 1);
    // this.allPhotosFilesArr.splice(index, 1);
    this.deleteItemObj = { index: index, type: 'photo' };
    this._modalService.open("remove-image-pop");
  }

  close(): void {
    this.deleteItemObj = {};
    this._modalService.close("remove-image-pop");    
  }

  deleteEvent(): void {
    this.isDeleteLoading = true;
    if (this.selectedTab == 1) {
      this.tempImgArr.splice(this.deleteItemObj.index, 1);    
    }
    if (this.selectedTab == 2) {
      this.etempImgArr.splice(this.deleteItemObj.index, 1);    
    }
    this.isDeleteLoading = false;
    this.close();
  }

  onSelectImages(event: any) {
    if (this.selectedTab == 1) {
      const totalPhotos = this.photosUploadLimit - ((this.tempImgArr?.length || 0) + (event?.addedFiles?.length || 0) + (this.imagesFiles?.length || 0));
      if ((totalPhotos >= 0) && (totalPhotos <= this.photosUploadLimit)) {
        this.imagesFiles.push(...event.addedFiles);
        this.rejectedPhotosList = event?.rejectedFiles;
      } else {
        this._sNotify.warning('You have exceeded the maximum photos limit!', 'Oops..');
      }
    }
    if(this.selectedTab == 2){
      const totalPhotos = this.photosUploadLimit - ((this.etempImgArr?.length || 0) + (event?.addedFiles?.length || 0) + (this.imagesFiles?.length || 0));
      if ((totalPhotos >= 0) && (totalPhotos <= this.photosUploadLimit)) {
        this.imagesFiles.push(...event.addedFiles);
        this.rejectedPhotosList = event?.rejectedFiles;
      } else {
        this._sNotify.warning('You have exceeded the maximum photos limit!', 'Oops..');
      }
    }
   
  }

  // Images Upload
  uploadImage(): any {
    if (this.descriptionLimit > CONSTANTS.CKEditorCharacterLimit0) {
      return false;
    }
    
    const responseObj: Observable<any>[] = [];
    this.imagesFiles.forEach((image: any) => {
      if (image != undefined) {
        if (image.type != 'image/jpeg' && image.type != 'image/jpg' && image.type != 'image/png' && image.type != 'image/gif' && image.type != 'image/avif' && image.type != 'image/raw') {
          this._sNotify.error('Images type should only jpeg, jpg, png, gif, avif and raw.', 'Oops!');
          return;
        }
        const image_size = image.size / 1024 / 1024;
        if (image_size > CONSTANTS.maxImageSizeInMB) {
          this._sNotify.error('Maximum Image Size is ' + CONSTANTS.maxImageSizeInMB + 'MB.', 'Oops!');
          return;
        }
        if (this.selectedTab == 1) {
          if (this.tempImgArr && this.tempImgArr.length && this.tempImgArr.length >= this.photosUploadLimit) {
            this._sNotify.error('Maximum 5 images can upload!', 'Oops!');
            this._modalService.close("photo");
            return;
          } 
        }else{
          if (this.etempImgArr && this.etempImgArr.length && this.etempImgArr.length >= this.photosUploadLimit) {
            this._sNotify.error('Maximum 5 images can upload!', 'Oops!');
            this._modalService.close("photo");
            return;
          }
        }
       
        const photoFormData = new FormData();
        photoFormData.append('file', image);
        this.isPhotoLoading = true;
        responseObj.push(this._createEventService.uploadImages(photoFormData));
        }
    });

    forkJoin(...responseObj).subscribe((resultArr: any) => {
      _.each(resultArr, (result: any) => {
        if (result && result.IsSuccess) {         
          if(this.selectedTab == 1){
            this.tempImgArr.push({ url: result.Data.url, description: this.photoForm.value?.description });
          }
          if (this.selectedTab == 2) {
            this.etempImgArr.push({ url: result.Data.url, description: this.photoForm.value?.description });
          } 
          this.photoForm.get('description').setValue('');
          this._sNotify.success('Image Uploaded Successfully.', 'Success');
          this.imagesFiles = [];
          this.isPhotoLoading = false;
          this.descriptionLimit = 2000;
          this._modalService.close('photo');
        } else {
          this._globalFunctions.successErrorHandling(result, this, true);
          this.isPhotoLoading = false;
        }
      });
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isPhotoLoading = false;
    });
  }

  onRemoveImages(event: any) {
    this.imagesFiles.splice(this.imagesFiles.indexOf(event), 1);
  }

  onTextEditorReady(editor: any, fieldForSetData: any): void {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  get arrangements() {
    return this.seatingForm.get('arrangements');
  }
  
  addArrangements(tempArrangementObj: any = {}): void {
    this.eventId = localStorage.getItem('eId');
    this._createEventService.getEvent(this.eventId).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.addEditEvent = result.Data.event_financial_type;
        this.isLoading = false;
          const arrangementsObj = this._formBuilder.group({
            number_of_seating_item: [tempArrangementObj?.number_of_seating_item || '', [Validators.required]],
            vertical_location: [tempArrangementObj?.vertical_location || this.constants.verticalLocationsArr[this.constants.verticalLocationsObj.NONE].value, [Validators.required]],
            horizontal_location: [tempArrangementObj?.horizontal_location || this.constants.horizontalLocationsArr[this.constants.horizontalLocationsObj.NONE].value, [Validators.required]],
            seat_type: [tempArrangementObj?.seat_type || this.constants.seatArr[this.constants.seatObj.NONE].value, [Validators.required]],
            per_seating_person: [tempArrangementObj?.per_seating_person || ''],
            total_person: [tempArrangementObj?.total_person || '', [Validators.required]],
            per_seating_price: [{value: (this.addEditEvent && this.addEditEvent == 'free') ? 0 : (tempArrangementObj?.per_seating_price || ''), disabled: !(!this.addEditEvent || this.addEditEvent == 'paid')}],
            per_person_price: [{value: (this.addEditEvent && this.addEditEvent == 'free') ? 0 : (tempArrangementObj?.per_person_price || ''), disabled: !(!this.addEditEvent || this.addEditEvent == 'paid')}, [Validators.required]],
            total_amount: [{value: (this.addEditEvent && this.addEditEvent == 'free') ? 0 : (tempArrangementObj?.total_amount || ''), disabled: !(!this.addEditEvent || this.addEditEvent == 'paid')}, [Validators.required]],
            description: [tempArrangementObj?.description || ''],
            booking_acceptance: [tempArrangementObj?.booking_acceptance || false],
          });
        this.arrangements.push(arrangementsObj);
        this.updateCalculatedValue();
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
        this.isLoading = false;
      }
      }, (error: any) => {
        this._globalFunctions.errorHanding(error, this, true);
        this.isLoading = false;
    });
  }

  removeArrangement(index: any): void {
    if (this.arrangements.get(index.toString())) {
      this.arrangements.removeAt(index.toString());
      this.arrangements.updateValueAndValidity();
      this.updateCalculatedValue();
      if (!this.arrangements?.value?.length) {
        this.addArrangements();
      }
    }
  }

  updateCalculatedValue(): void {
    this.totalArrangementsObj = {
      total_number_of_seating_items: 0,
      total_per_seating_persons: 0,
      per_seating_person: 1,
      total_persons: 0,
      per_seating_price: 0,
      per_person_price: 0,
      total_amount: 0,
      total_booked: 0
    };
    _.each(this.arrangements.value, (arrangement: any, index: number) => {
      if (arrangement.number_of_seating_item && arrangement.per_seating_person) {
        this.arrangements.controls[index].get('total_person')?.setValue((arrangement.number_of_seating_item * arrangement.per_seating_person));
        this.arrangements.controls[index].get('per_person_price')?.setValue(Number((arrangement.per_seating_price / arrangement.per_seating_person).toFixed(2)));
        this.arrangements.controls[index].get('total_amount')?.setValue((arrangement.per_seating_price * arrangement.number_of_seating_item));
        
      } else if (this.selectedSeatingObj && (this.selectedSeatingObj.itemname == 'Chair' || this.selectedSeatingObj.itemname == 'chair' || this.selectedSeatingObj.itemname == 'Standing' || this.selectedSeatingObj.itemname == 'standing' || this.selectedSeatingObj.itemname == 'stand' || this.selectedSeatingObj.itemname == 'Stand')) {
        this.arrangements.controls[index].get('total_person')?.setValue((arrangement.number_of_seating_item));
        this.arrangements.controls[index].get('total_amount')?.setValue((arrangement.number_of_seating_item * arrangement.per_person_price));
        this.arrangements.controls[index].get('booking_acceptance')?.setValue(false);
        this.arrangements.controls[index].get('per_seating_person')?.setValue((arrangement.total_persons / arrangement.number_of_seating_item));
        
      } 
    });
    _.each(this.arrangements.value, (arrangement: any) => {
      this.totalArrangementsObj.total_number_of_seating_items += Number(arrangement?.number_of_seating_item || 0);
      this.totalArrangementsObj.total_per_seating_persons += Number(arrangement?.per_seating_person || 1);
      this.totalArrangementsObj.total_persons += Number(arrangement?.total_person || 0);
      this.totalArrangementsObj.per_seating_price += Number(arrangement?.per_seating_price || 0);
      this.totalArrangementsObj.per_person_price += Number(arrangement?.per_person_price || 0);
      this.totalArrangementsObj.total_amount += Number(arrangement?.total_amount || 0);
    });
  }

  closePop(flag: boolean): void {
    this.isOpenPopup = flag;
  }

  prepareSeatingItems(): void {
    if (this.isInitial && this.arrangementsArr && this.arrangementsArr.length &&
      (!this.editArrangementObj || !this.editArrangementObj.seating_item)) {
      const arrangementKeys = Object.keys(_.keyBy(this.arrangementsArr, 'seating_item._id'));
      _.each(arrangementKeys, (key: any) => {
        this.seatingItems = _.remove(this.seatingItems, (seatingItem: any) => { return seatingItem._id != key; });
      });
      this.isInitial = false;
    }
  }

  onSeatingItemChange(): void {
    this.selectedSeatingObj = _.find(this.seatingItems, ['_id', this.seatingForm.get('seating_item').value]);
    this.arrangements.controls = [];
    this.addArrangements();
    if (this.selectedSeatingObj && (!this.selectedSeatingObj.isonlyperperson)) {
      Object.keys(this.arrangements.controls).forEach((key) => {
        Object.keys(this.arrangements.controls[key].controls).forEach((subKey) => {
          if (subKey == 'per_seating_person') {
            this.arrangements.controls[key].get('per_seating_person').setValidators([Validators.required]);
            this.arrangements.controls[key].get('per_seating_person').updateValueAndValidity();
            this.arrangements.controls[key].get('per_seating_price').setValidators([Validators.required]);
            this.arrangements.controls[key].get('per_seating_price').updateValueAndValidity();
          }
        });
      });
    }
  }

  selectItems(): void {
    this._sNotify.clear();
    if (this.seatingForm.invalid) {
      Object.keys(this.seatingForm.controls).forEach((key) => {
        this.seatingForm.controls[key].touched = true;
        this.seatingForm.controls[key].markAsDirty();
      });
      Object.keys(this.arrangements.controls).forEach((key) => {
        Object.keys(this.arrangements.controls[key].controls).forEach((subKey) => {
          this.arrangements.controls[key].controls[subKey].touched = true;
          this.arrangements.controls[key].controls[subKey].markAsDirty();
        });
      });
      return;
    }
    if (this.arrangements.value && this.arrangements.value.length) {
      const tmpLocations: any = [];
      _.each(this.arrangements.value, (arrangement: any) => {
        tmpLocations.push(arrangement.vertical_location + arrangement.horizontal_location);
      });
      const uniqueLocationLength: any = _.uniq(tmpLocations);
      if (uniqueLocationLength && uniqueLocationLength.length != this.arrangements.length) {
        this._sNotify.error('Please select unique combination of vertical and horizontal locations.', 'Oops!');
        return;
      }
    }
    this.editorCharacterSetFood();
    this.editorCharacterSetEquipment();
    this.selectedTab = 1;
  }

  addFormData(): void {
    if (this.textEditorLimitEquipment && this.textEditorMaxLimit && this.textEditorLimitEquipment > this.textEditorMaxLimit) {
      return;
    }
    if (!this.arrangementsArr || !this.arrangementsArr.length) {
      this.arrangementsArr = [];
    }
    let preparedSeatingArr: any = this.arrangementsArr || [];
    if (this.editArrangementObj && this.editArrangementObj.seating_item) {
      preparedSeatingArr = [];
      _.each(this.arrangementsArr, (arrangement: any) => {
        if (this.editArrangementObj.seating_item != arrangement.seating_item) {
          preparedSeatingArr.push(arrangement);
        }
      });
    } else {
      preparedSeatingArr = this.arrangementsArr || [];
    }
    const seatingObj: any = this.seatingForm.value;
    seatingObj.totalCalculations = this.totalArrangementsObj;
    seatingObj.seating_item = (this.editArrangementObj && this.editArrangementObj.seating_item) ? this.editArrangementObj.seating_item : _.find(this.seatingItems, ['_id', seatingObj.seating_item]);
    seatingObj.seating_item_id = seatingObj.seating_item._id;
    preparedSeatingArr.push(seatingObj);
    this.arrangementsArr = preparedSeatingArr;
    this.closePopup(this.arrangementsArr);
  }

  editorCharacterSetFood(): any {
    this.textEditorLimitFood = '0';
    const textfield = this.seatingForm.value.food_description;
    if (textfield && textfield != '') {
      const stringOfCKEditor = this._globalFunctions.getPlainText(textfield);
      this.textEditorLimitFood = stringOfCKEditor.length;
      this.textEditorFood = (stringOfCKEditor.length > this.textEditorMaxLimit);
    }
  }

  editorCharacterSetEquipment(): any {
    this.textEditorLimitEquipment = '0';
    const textfield = this.seatingForm.value.equipment_description;
    if (textfield && textfield != '') {
      const stringOfCKEditor = this._globalFunctions.getPlainText(textfield);
      this.textEditorLimitEquipment = stringOfCKEditor.length;
      this.textEditorEquipment = (stringOfCKEditor.length > this.textEditorMaxLimit);
    }
  }

  closePopup(arrangementsArr: any = []): void {
    this.addEditArrangement.emit(arrangementsArr);
    this.isAddEventChange.emit(false);
  }

  private _prepareArrangementForm(): void {
    this.eventId = localStorage.getItem('eId');
    this._createEventService.getEvent(this.eventId).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.addEditEvent = result.Data.event_financial_type;
        this.isLoading = false;
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
        this.isLoading = false;
      }
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
    });
    this.seatingForm = this._formBuilder.group({
      seating_item: [{
        value: (this.editArrangementObj && this.editArrangementObj.seating_item) ?
          ((this.editArrangementObj.seating_item._id) ? this.editArrangementObj.seating_item._id : this.editArrangementObj.seating_item) : null, disabled: (this.editArrangementObj && this.editArrangementObj.seating_item)
      }, [Validators.required]],
      arrangements: this._formBuilder.array([]),
      food_included_in_ticket_price:[(!!(this.editArrangementObj && this.editArrangementObj?.food_included_in_ticket_price)), [Validators.required]],
      food: [this.editArrangementObj?.food || 'VEG', [Validators.required]],
      food_details:[
      ],
      food_description: [this.editArrangementObj?.food_description || ''],
      equipment_included_in_ticket_price: [(!!(this.editArrangementObj && this.editArrangementObj.equipment_included_in_ticket_price)), [Validators.required]],
      equipment_details:[
      ],
      equipment_description: [this.editArrangementObj?.equipment_description || null],
    });
 
    if (this.editArrangementObj && this.editArrangementObj.arrangements) {
      _.each(this.editArrangementObj.arrangements, (arrangement: any) => {
        this.addArrangements(arrangement);
      });
    } else {
      this.addArrangements();
    }
  }
}
