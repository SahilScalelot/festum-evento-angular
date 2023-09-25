import { Component, OnInit } from '@angular/core';
import { SnotifyService } from 'ng-snotify';
import { GlobalService } from 'src/app/services/global.service';
import { GlobalFunctions } from '../../common/global-functions';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-refer-and-earn',
  templateUrl: './refer-and-earn.component.html',
  styleUrls: ['./refer-and-earn.component.scss']
})
export class ReferAndEarnComponent implements OnInit {
  isLoading: boolean = false;
  userObj: any = {};
  referralCode: string = '';
  referralLink: string = `${window.location.origin}/?ref=${this.referralCode}`;

  constructor(
    private _globalService: GlobalService,
    private _globalFunctions: GlobalFunctions,
    private _sNotify: SnotifyService,
    private _clipboard: Clipboard
  ) { }

  ngOnInit(): void {
    this._globalService.loginUser$.subscribe((user: any) => {
      this.isLoading = true;
      if (user) {
        this.userObj = this._globalFunctions.copyObject(user);
        this.referralCode = this.userObj.my_refer_code;
        this.isLoading = false;
      }
    });
  }

  shareOnWhatsApp() {
    const text = `Check out this amazing offer! Use my referral code: ${this.referralCode}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  }

  shareOnFacebook() {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.referralLink)}`;
    window.open(shareUrl, '_blank');
  }

  shareOnTelegram() {
    const text = `Check out this amazing offer! Use my referral code: ${this.referralCode}`;
    const url = `https://t.me/share/url?url=${encodeURIComponent(this.referralLink)}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  }

  shareOnTwitter() {
    const text = `Check out this amazing offer! Use my referral code: ${this.referralCode}`;
    const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(this.referralLink)}&text=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank');
  }

  shareViaSMS() {
    const message = `Check out this amazing offer! Use my referral code: ${this.referralCode}`;
    const url = `sms:?&body=${encodeURIComponent(message)}`;
    window.location.href = url;
  }

  shareByEmail() {
    const subject = 'Check out this amazing offer!';
    const body = `Use my referral code: ${this.referralCode}\n\n${this.referralLink}`;
    const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
  }

  copyLink(copyText: any) {
    this._clipboard.copy(copyText);
    this._sNotify.success('Code Copied.');
  }

}
