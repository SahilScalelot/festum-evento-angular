import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {Location} from '@angular/common';
import {AuthService} from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {

  constructor(
    private _authService: AuthService,
    private _location: Location
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
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
      this._location.back();
      return false;
    } else {
      return true;
    }
  }
}
