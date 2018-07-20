import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import * as muse from 'museblockchain-js';

import { AlertService } from './alert.service';
import { UIService } from './ui.service';

import { environment } from '../../environments/environment';
import { MuseKeys } from '../models/muse-keys';
import { User } from '../models/user';
import { Observable } from 'rxjs/Observable';
import { UserService } from './user.service';

@Injectable()
export class AuthService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private alert: AlertService,
    private userService: UserService,
    private ui: UIService
  ) {

    // Persistence
    this.user$ = this.afAuth.authState.switchMap(user => {
      if (user) {
        return this.userService.getUser(user.uid);
      } else {
        return Observable.of(null);
      }
    });
    this.user$.subscribe((user: User) => {
      this.user = user;
      if (!user) {
        sessionStorage.removeItem('password');
        this.ui.hideLoading();
      }
    });

  }

  private url = environment.apiUrl + 'auth/';
  user: User = new User();
  user$: Observable<User>;

  register(user: User) {

    // Muse Connect Register
    this.http.post(this.url + 'register', user).subscribe((response: any) => {

      // Firebase Login
      this.afAuth.auth.signInWithCustomToken(response.token).then((userRecord) => {

        // Email Verification
        userRecord.user.sendEmailVerification().then(result => {

          // Success Message
          this.alert.showSuccessMessage('Success', 'A confirmation email has been sent, please verify your address before login.');

          // Redirect
          this.router.navigateByUrl('/login');

        }).catch(error => {
          this.alert.showErrorMessage(error);
        });

      }).catch(error => {
        this.alert.showErrorMessage(error);
      });

    }, error => {
      this.alert.showErrorMessage(error.error.error);
    });

  }

  login(user: User) {

    this.ui.showLoading();

    // Muse Connect Login
    this.http.post(this.url + 'login', user).subscribe((response: any) => {

      this.afAuth.auth.setPersistence('session').then(() => {

        this.afAuth.auth.signInWithCustomToken(response.token).then(authUser => {

          // Get user Informations & Update it in client
          this.userService.getUser(authUser.user.uid).subscribe((res: User) => {

            // Set User
            this.user = new User(res.id, res.musername, res.email, res.key, res.roles);
            this.user.encryptPassword(user.password);
            this.userService.updateUser(this.user).subscribe((usr: User) => {

              // Redirect
              this.ui.hideLoading();
              this.router.navigateByUrl('/');

            }, error => {
              this.ui.hideLoading();
              this.alert.showErrorMessage(error);
            });

          });

        }).catch(error => {
          this.ui.hideLoading();
          this.alert.showErrorMessage(error);
        });

      }).catch(error => {
        this.ui.hideLoading();
        this.alert.showErrorMessage(error);
      });

    }, error => {
      this.ui.hideLoading();
      if (error.error.error && error.error.error.message) {
        this.alert.showErrorMessage(error.error.error.message);
      } else {
        this.alert.showErrorMessage(error.error.error);
      }
    });

  }

  logout() {

    // Reset Session
    this.afAuth.auth.signOut().then(result => {

      // Reset Session
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('password');

      // Reset User
      this.user = new User();
      this.user$ = Observable.of(null);

      // Redirect
      this.router.navigateByUrl('/login');

    });

  }

  // region Roles

  isUser(user: User): boolean {
    const allowed = ['admin', 'management', 'user'];
    return this.checkAuthorization(user, allowed);
  }

  isManagement(user: User): boolean {
    const allowed = ['admin', 'management'];
    return this.checkAuthorization(user, allowed);
  }

  isAdmin(user: User): boolean {
    const allowed = ['admin'];
    return this.checkAuthorization(user, allowed);
  }

  private checkAuthorization(user: User, allowedRoles: string[]): boolean {

    if (!user) {
      return false;
    }

    for (const role of allowedRoles) {
      if (user && user.roles && user.roles[role]) {
        if (user.roles[role]) {
          return true;
        }
      }
    }

    return false;
  }

  // endregion

  // region Muse

  setSocket() {
    muse.config.set('websocket', 'wss://api.muse.blckchnd.com');
  }

  getPrivateKeys(musername, password): Promise<void | MuseKeys> {

    // Set Socket
    this.setSocket();

    // Get Keys
    return new Promise<MuseKeys>(function (resolve, reject) {

      const keys = muse.auth.getPrivateKeys(musername, password, ['owner', 'active', 'basic', 'memo']);

      if (!keys) {
        reject('Failed to load keys.');
      }

      resolve(keys);

    }).catch((err) => {
      this.alert.showErrorMessage('getPrivateKeys(): ' + err);
    });

  }

  updateAccountKeys(muserName, password, newPassword, ownerPubkey, activePubkey, basicPubkey, memoPubkey): Promise<void | boolean> {

    const user = this.user;
    const alert = this.alert;
    this.setSocket();

    return new Promise<boolean>(function (resolve, reject) {

      muse.updateAccountKeys(muserName, password, ownerPubkey, activePubkey, basicPubkey, memoPubkey, (code, message) => {

        if (code === 0) {

          user.encryptPassword(newPassword);
          this.userService.updateUser(user).subscribe(usr => {

            alert.showSuccessMessage('Password Changed!', 'Your password has been successfully changed.'); // TODO: Set messages in a resource file
            resolve(true);

          });

        } else {
          reject(message);
        }

      });

    }).catch((err) => {
      this.alert.showErrorMessage('updateAccountKeys(): ' + err);
    });

  }

  // endregion

}
