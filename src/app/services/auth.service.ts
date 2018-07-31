import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import * as sdac from 'museblockchain-js';

import { AlertService } from './alert.service';
import { UIService } from './ui.service';

import { environment } from '../../environments/environment';
import { SdacKeys } from '../models/sdac-keys';
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

      // Set User
      if (user) {
        this.user = user;
      } else {
        this.ui.hideLoading();
      }

    });

  }

  private url = environment.apiUrl + 'auth/';
  user: User = new User();
  user$: Observable<User>;

  register(user: User) {

    this.ui.showLoading();

    // Sdac API Register
    this.http.post(this.url + 'register', user).subscribe((response: any) => {

      // Firebase Login
      this.afAuth.auth.signInWithCustomToken(response.token).then((userRecord) => {

        // Email Verification
        userRecord.user.sendEmailVerification().then(result => {

          // Hide Loader
          this.ui.hideLoading();

          // Success Message
          this.alert.showSuccessMessage('Success', 'A confirmation email has been sent, please verify your address before login.');

          // Redirect
          this.router.navigateByUrl('/login');

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
        this.alert.showErrorMessage(error.message);
      }
    });

  }

  login(user: User, key: string) {

    this.ui.showLoading();

    // Sdac API Login
    this.http.post(this.url + 'login', user).subscribe((response: any) => {

      this.afAuth.auth.setPersistence('session').then(() => {

        this.afAuth.auth.signInWithCustomToken(response.token).then(authUser => {

          const auth = this;

          // Get Invite Key
          this.afs.collection('keys').doc('invite').ref.get().then(function (keyDoc) {

            // Get user Informations & Update it in client
            auth.userService.getUser(authUser.user.uid).subscribe((res: User) => {

              console.log(keyDoc.data());

              // Set User
              auth.user = new User(res.id, res.username, res.email, res.key, res.roles);
              auth.user.encryptPassword(user.password);

              if (key && key !== '') {
                if (key === keyDoc.data().key) {
                  auth.user.roles.management = true;
                }
              }

              auth.user$ = Observable.of(auth.user);
              auth.userService.updateUser(auth.user).subscribe((usr: User) => {

                // Redirect
                auth.ui.hideLoading();
                auth.router.navigateByUrl('/');

              }, error => {
                auth.ui.hideLoading();
                auth.alert.showErrorMessage(error);
              });

            });

          }).catch(function (error) {
            console.log('Error getting document:', error);
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
      this.user$ = Observable.of(null);
      this.user = new User();

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

    if (!user || !user.id) {
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

  // region SDAC

  setSocket() {
    sdac.config.set('websocket', 'wss://api.muse.blckchnd.com');
  }

  getPrivateKeys(username, password): Promise<void | SdacKeys> {

    // Set Socket
    this.setSocket();

    // Get Keys
    return new Promise<SdacKeys>(function (resolve, reject) {

      const keys = sdac.auth.getPrivateKeys(username, password, ['owner', 'active', 'basic', 'memo']);

      if (!keys) {
        reject('Failed to load keys.');
      }

      resolve(keys);

    }).catch((err) => {
      this.alert.showErrorMessage('getPrivateKeys(): ' + err);
    });

  }

  updateAccountKeys(username, password, newPassword, ownerPubkey, activePubkey, basicPubkey, memoPubkey): Promise<void | boolean> {

    const user = this.user;
    const alert = this.alert;
    this.setSocket();

    return new Promise<boolean>(function (resolve, reject) {

      sdac.updateAccountKeys(username, password, ownerPubkey, activePubkey, basicPubkey, memoPubkey, (code, message) => {

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
