import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import { CONSTANTS } from 'src/app/main/common/constants';
import { GlobalFunctions } from 'src/app/main/common/global-functions';
import { OnlineOffersService } from '../online-offers.service';
import { GlobalService } from 'src/app/services/global.service';
import { NgSelectConfig } from "@ng-select/ng-select";
import * as _ from 'lodash';

@Component({
  selector: 'app-platform_links',
  templateUrl: './platform_links.component.html',
  styleUrls: ['./platform_links.component.scss']
})
export class PlatformLinksComponent implements OnInit {
  constants: any = CONSTANTS;
  linkForm: any;
  short_link_id: any;

  constructor(
    private _formBuilder: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _sNotify: SnotifyService,
    private _onlineOffersService: OnlineOffersService,
    private _globalFunctions: GlobalFunctions,
    private _config: NgSelectConfig,
    private _globalService: GlobalService
  ) {
    this._config.notFoundText = 'Platform not found';
  }

  ngOnInit(): void {
    this.short_link_id = this._activatedRoute.snapshot.paramMap.get('linkId');
    console.log(this.short_link_id);
    
  }

  private _prepareLinkForm(linkForm: any = {}): void {
    this.linkForm = this._formBuilder.group({
      short_link_id: [this.short_link_id || ''],
      contact_no: [linkForm?.contact_no || '', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
    });
  }
}