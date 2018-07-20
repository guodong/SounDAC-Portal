import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AlertService } from '../alert.service';
import { AuthService } from '../auth.service';

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
  ): Observable<boolean> {

    if (this.auth.isUser(this.auth.user)) {
      return Observable.of(true);
    }

    // Alert Warning
    this.alert.showErrorMessage('Access Denied - Must be logged');

    // Redirect
    this.router.navigateByUrl('/login');

    return Observable.of(false);

  }
}
