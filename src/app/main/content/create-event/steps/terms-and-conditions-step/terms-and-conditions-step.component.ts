import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
// @ts-ignore
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { ModalService } from 'src/app/main/_modal';

@Component({
  selector: 'app-terms-and-conditions-step',
  templateUrl: './terms-and-conditions-step.component.html',
  styleUrls: ['./terms-and-conditions-step.component.scss']
})
export class TermsAndConditionsStepComponent implements OnInit {
  termsAndConditionsForm: any;
  detailEditor = DecoupledEditor;
  editorConfig: any = {};
  agreeTAndC: boolean = false;

  termsAndConditionsObj: any = {terms_and_conditions: {}};

  constructor(
    private _formBuilder: FormBuilder,
    private _modalService: ModalService
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('newEventObj')) {
      const eventString: any = localStorage.getItem('newEventObj');
      this.termsAndConditionsObj = JSON.parse(eventString);
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
      mediaEmbed: {previewsInData: true},
      table: {contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']},
      language: 'en',
      alignment: {options: ['left', 'right', 'center', 'justify']},
      fontSize: {options: ['tiny', 'small', 'default', 'big', 'huge']},
      fontColor: {
        columns: 6,
        colors: [
          {color: '#f05a28', label: 'Theme Orange', class: 'orange'},
          {color: 'hsl(0, 0%, 0%)', label: 'Black'},
          {color: 'hsl(0, 0%, 30%)', label: 'Dim grey'},
          {color: 'hsl(0, 0%, 60%)', label: 'Grey'},
          {color: 'hsl(0, 0%, 90%)', label: 'Light grey'},
          {color: 'hsl(0, 0%, 100%)', label: 'White', hasBorder: true},
          {color: '#f8696b', label: 'Red 1'},
          {color: '#FFD800', label: 'Yellow 1'},
          {color: '#63be7b', label: 'Green 1'},
          {color: '#f44336', label: 'Red 2'},
          {color: '#ff9100', label: 'Yellow 2'},
          {color: '#4caf50', label: 'Green 2'},
          {color: 'hsl(0, 75%, 60%)', label: 'Red'},
          {color: 'hsl(30, 75%, 60%)', label: 'Orange'},
          {color: 'hsl(60, 75%, 60%)', label: 'Yellow'},
          {color: 'hsl(90, 75%, 60%)', label: 'Light green'},
          {color: 'hsl(120, 75%, 60%)', label: 'Green'},
          {color: 'hsl(150, 75%, 60%)', label: 'Aquamarine'},
          {color: 'hsl(180, 75%, 60%)', label: 'Turquoise'},
          {color: 'hsl(210, 75%, 60%)', label: 'Light blue'},
          {color: 'hsl(240, 75%, 60%)', label: 'Blue'},
          {color: 'hsl(270, 75%, 60%)', label: 'Purple'}
        ]
      },
      fontBackgroundColor: {
        columns: 6,
        colors: [
          {color: '#f05a28', label: 'Theme Orange'},
          {color: 'hsl(0, 0%, 0%)', label: 'Black'},
          {color: 'hsl(0, 0%, 30%)', label: 'Dim grey'},
          {color: 'hsl(0, 0%, 60%)', label: 'Grey'},
          {color: 'hsl(0, 0%, 90%)', label: 'Light grey'},
          {color: 'hsl(0, 0%, 100%)', label: 'White', hasBorder: true},
          {color: '#f8696b', label: 'Red 1'},
          {color: '#FFD800', label: 'Yellow 1'},
          {color: '#63be7b', label: 'Green 1'},
          {color: '#f44336', label: 'Red 2'},
          {color: '#ff9100', label: 'Yellow 2'},
          {color: '#4caf50', label: 'Green 2'},
          {color: 'hsl(0, 75%, 60%)', label: 'Red'},
          {color: 'hsl(30, 75%, 60%)', label: 'Orange'},
          {color: 'hsl(60, 75%, 60%)', label: 'Yellow'},
          {color: 'hsl(90, 75%, 60%)', label: 'Light green'},
          {color: 'hsl(120, 75%, 60%)', label: 'Green'},
          {color: 'hsl(150, 75%, 60%)', label: 'Aquamarine'},
          {color: 'hsl(180, 75%, 60%)', label: 'Turquoise'},
          {color: 'hsl(210, 75%, 60%)', label: 'Light blue'},
          {color: 'hsl(240, 75%, 60%)', label: 'Blue'},
          {color: 'hsl(270, 75%, 60%)', label: 'Purple'}
        ]
      }
    };
    this._preparePersonalDetailForm();
  }

  onTextEditorReady(editor: any, fieldForSetData: any): void {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
    // if (this.productObj[fieldForSetData]) {
    //   editor.setData(this.productObj[fieldForSetData]);
    // }
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
    // console.log(this.termsAndConditionsForm.value);

    if (this.termsAndConditionsForm.invalid) {
      // this.termsAndConditionsForm.controls.markAsDirty();
      Object.keys(this.termsAndConditionsForm.controls).forEach((key) => {
        this.termsAndConditionsForm.controls[key].touched = true;
        this.termsAndConditionsForm.controls[key].markAsDirty();
      });
      return;
    }
    
    const preparedObj = this.prepareObj(this.termsAndConditionsForm.value);
    this.termsAndConditionsObj.terms_and_conditions = preparedObj;
    
    JSON.stringify({terms_and_conditions: preparedObj});
    localStorage.setItem('newEventObj', JSON.stringify(this.termsAndConditionsObj));
  }
  
  prepareObj(companyObj: any = {}): any {
    const preparedObj: any = companyObj;
    return preparedObj;
  }
  
  private _preparePersonalDetailForm(): void {
    this.termsAndConditionsForm = this._formBuilder.group({
      event_terms_and_conditions: [this.termsAndConditionsObj?.terms_and_conditions?.event_terms_and_conditions, [Validators.required]],
      facebook_url: [this.termsAndConditionsObj?.terms_and_conditions?.facebook_url],
      youtube_url: [this.termsAndConditionsObj?.terms_and_conditions?.youtube_url],
      twitter_url: [this.termsAndConditionsObj?.terms_and_conditions?.twitter_url],
      pinterest_url: [this.termsAndConditionsObj?.terms_and_conditions?.pinterest_url],
      instagram_url: [this.termsAndConditionsObj?.terms_and_conditions?.instagram_url],
      linkedin_url: [this.termsAndConditionsObj?.terms_and_conditions?.linkedin_url],
      terms_and_conditions: [false, {disabled: true}],
    });
  }
}
