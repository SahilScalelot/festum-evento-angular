import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { GlobalFunctions } from '../../common/global-functions';
import * as _ from 'lodash';
import { GlobalService } from 'src/app/services/global.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private _authService: AuthService,
    private _router: Router,
    private _globalFunctions: GlobalFunctions,
    private _globalService: GlobalService,
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const token = localStorage.getItem('accessToken');
    if (token && token != "") {
      return new Promise((resolve, reject) => {
        if (token && token != '') {
          Promise.all([
            this.verify(state.url)
          ]).then(() => {
            resolve(true);
          }, reject);
        } else {
          this.redirectLogin();
          reject();
        }
      });
    } else {
      // this._router.navigate(['/']);
      return false;
    }
  }

  verify(url: any): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(true);
      this._authService.getLoginUser().subscribe((result: any) => {
        if (result.IsSuccess) {
          const user = _.clone(result.Data);
          this._globalService.loginUser$.next(user);
          resolve(true);
        } else {
          this._globalFunctions.successErrorHandling(result, this, true);
          this.redirectLogin();
          reject();
        }
      }, (error: any) => {
        this._globalFunctions.errorHanding(error, this, true);
        this.redirectLogin();
        reject();
      });
    });
  }

  redirectLogin(): void {
    // localStorage.clear();
    // this._router.navigate(['login']);
  }
}
