import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AlertService } from '../alert.service';
import { AuthService } from '../auth.service';
import { User } from '../../models/user';

@Injectable()
export class UserGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private alert: AlertService,
    private router: Router,
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {

    // Done inside map to make sure we have the user loaded
    return this.auth.user$.map(user => {

      // Set User
      this.auth.user = user;

      // Check User
      if (this.auth.isUser(this.auth.user)) {
        return true;
      }

      // Alert Warning
      // this.alert.showErrorMessage('Access Denied - Must be logged');

      // Redirect
      this.router.navigateByUrl('/login');

      return false;

    });

  }

}
