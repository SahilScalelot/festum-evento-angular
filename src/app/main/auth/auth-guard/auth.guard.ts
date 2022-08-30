import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private _authService: AuthService,
    private _router: Router
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const token = localStorage.getItem('accessToken');
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
  }

  verify(url: any): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(true);
      // this._authService.getLoginUser().subscribe(
      //   (result: any) => {
      //     if (result.flag) {
      //       const userPermissions = _.clone(result.data.rp);
      //       const pageModuleKey = url.split('/')[1];
      //       const moduleObj = _.find(CONSTANTS.moduleObj, ['key', pageModuleKey]);
      //       this._globalService.userPermissions$.next(userPermissions);
      //       const preparedUser = _.clone(result.data.user);
      //       preparedUser.profile_image = (preparedUser && preparedUser.profile_image) ?
      //         (CONSTANTS.imageBasePaths.PROFILE_IMAGE_PATH + preparedUser.profile_image) : CONSTANTS.userDefaultImage;
      //       this._globalService.loginUser$.next(preparedUser);
      //       if (moduleObj && moduleObj.id && userPermissions && userPermissions[moduleObj.id] &&
      //         !(userPermissions[moduleObj.id][CONSTANTS.accessType.VIEW])) {
      //         this._router.navigate(['/dashboard']);
      //         reject();
      //       }
      //       resolve(true);
      //     } else {
      //       this._globalFunctions.successErrorHandling(result, this, true);
      //       this.redirectLogin();
      //       reject();
      //     }
      //   }, (error: any) => {
      //     this._globalFunctions.errorHanding(error, this, true);
      //     this.redirectLogin();
      //     reject();
      //   }
      // );
    });
  }

  redirectLogin(): void {
    localStorage.clear();
    this._router.navigate(['login']);
  }
}
