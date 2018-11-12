import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../auth.service';
import { AlertService } from '../alert.service';
import { tap, map, take } from 'rxjs/operators';

@Injectable()
export class ManagementGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private alert: AlertService,
    private router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {

    // Done inside map to make sure we have the user loaded
    return this.auth.user$.map(user => {

      // Set User
      this.auth.user = user;

      if (this.auth.isManagement(this.auth.user)) {

        return true;

      } else {

        // Alert Warning
        this.alert.showErrorMessage('Access Denied - Management & Admin Only');

        // Redirect
        this.router.navigateByUrl('/');


      }

      return false;

    });

  }
}
