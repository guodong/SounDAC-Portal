// Core
import { Injectable } from '@angular/core';

// Modules
import * as firebase from 'firebase';

// Models
import { RmpUsers } from '../models/rmp-users';
import { User } from '../models/user';
import { AuthService } from './auth.service';
import { isFulfilled } from '../../../node_modules/@types/q';

@Injectable()
export class AdminService {

  constructor(
    private auth: AuthService
  ) { }

  importRMPUsers() {

    // Instructions
    // Make sure the project inside .firebaserc is "rights-management-portal"
    // Run firebase auth:export accounts-rmp.json
    // Copy accounts-rmp.json array content into rmp-users.ts model
    // Make sure the project inside .firebaserc is "api-museblockchain"
    // Run firebase auth:import accounts.rmp.json
    // Click the import button in admin dashboard
    // Let your app do the rest
    // Account should all have been updated

    if (this.auth.isAdmin(this.auth.user)) {

      let i: number = 0;

      RmpUsers.forEach(rmpAuthUsers => {
        firebase.app('rightsManagementPortal').database().ref('users/' + rmpAuthUsers.localId).once('value').then(function (snapshot) {
          if (snapshot.val()) {

            const user: User = new User(snapshot.val().uid, snapshot.val().userName.toLowerCase(), snapshot.val().email);
            user.dateCreated = snapshot.val().dateAdded;
            user.roles = Object.assign({}, user.roles);

            firebase.app('sdacApi').firestore().collection('users').doc(user.id).set(Object.assign({}, user)).then(function () {

              // Increment for Progress
              i++;

              // Calc Percentage
              const progress: number = Math.round((i * 100) / RmpUsers.length) * 2;

              console.log(user.musername + ' written succesfully! - Progress: ' + progress + '%');

            }).catch(function (error) {
              console.error('Error writing document: ', error);
            });

          }
        });
      });

    }

  }

}
