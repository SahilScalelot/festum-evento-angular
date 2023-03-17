import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {

  constructor(
    private _authService: AuthService,
    private _location: Location,
    private _router: Router
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const splittedUrl = state.url.split('/');

    if (state.url.includes('register') && splittedUrl[1] == 'register' && splittedUrl[2] && splittedUrl[2] != '') {
      const isVerified = this._checkAgent(splittedUrl[2]);
      if (isVerified) {
        return true;
      }
    }

    return new Promise((resolve, reject) => {
      Promise.all([
        this._check(state)
      ]).then(() => {
        resolve(true);
      }, reject);
    });
  }

  private _check(state: any): boolean {
    // Check the authentication status
    const accessToken = localStorage.getItem('accessToken');
    const otpToken = localStorage.getItem('otpToken');

    if (accessToken) {
      // this._location.back();
      this._router.navigate(['/events']);
      return false;
    } else {
      if (!state.url || state.url == '/') {
        this._router.navigate(['login']);
      }
      return true;
    }
  }

  private _checkAgent(agentId: any): boolean {
    // this._location.back();
    this._authService.checkAgent(agentId).subscribe((result: any) => {
      console.log(result.IsSuccess);
      if (result && result.IsSuccess && result.IsSuccess == true) {
        localStorage.clear();
        this._router.navigate(['/register/' + agentId]);
        return true;
      } else {
        return false;
      }
    })
    return false;
  }
}
