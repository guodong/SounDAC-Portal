// Core
import { Injectable } from '@angular/core';

// Modules
import * as firebase from 'firebase';

// Services
import { FirestoreService } from './firestore.service';

// Models
import { RmpUsers } from '../models/rmp-users';
import { User } from '../models/user';
import { AuthService } from './auth.service';

@Injectable()
export class AdminService {

  constructor(
    private auth: AuthService,
    private db: FirestoreService
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

            const user: User = new User(snapshot.val().uid, snapshot.val().muserName.toLowerCase(), snapshot.val().email);
            user.dateCreated = snapshot.val().dateAdded;
            user.roles = Object.assign({}, user.roles);

            firebase.app('sdacApi').firestore().collection('users').doc(user.id).set(Object.assign({}, user)).then(function () {

              // Increment for Progress
              i++;

              // Calc Percentage
              const progress: number = Math.round((i * 100) / RmpUsers.length) * 2;

              console.log(user.username + ' written succesfully! - Progress: ' + progress + '%');

            }).catch(function (error) {
              console.error('Error writing document: ', error);
            });

          }
        });
      });

    }

  }

  correctCurrentUsers() {

    firebase.app('sdacApi').firestore().collection('users').get().then(function (docs) {

      docs.docs.forEach(doc => {
        console.log(doc.data());

        const user = doc.data();
        user.username = doc.data().musername;

        firebase.app('sdacApi').firestore().collection('users').doc(doc.data().id).update(user).then( result => {
          console.log(user.username + ' updated!');
        }).catch(error => {
          console.log('fuck');
        });

      });

    }).catch(function (error) {
      console.log('Error getting document:', error);
    });

  }

}
