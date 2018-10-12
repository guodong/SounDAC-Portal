// Core
import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/database';

import { Observable } from 'rxjs/Observable';
import { UIService } from './ui.service';

// Models
import { User } from '../models/user';
import { Timestamp } from '@firebase/firestore-types';

@Injectable()
export class AdminUserService {

  constructor(
    private ui: UIService
  ) { }

  private db = firebase.app('sdacApi');

  // This Method doesn't return the full list, only a snap. Gotta work something with cursor
  // getUsers(): Observable<User[]> {

  //   const d = new Date();
  //   d.setHours(d.getHours() - 24);

  //   // Returning has observable so list update itself when running a new report or deleting one
  //   return new Observable(observer => {
  //     this.db.firestore().collection('users').where('createdAt', '>=', d).orderBy('createdAt', 'desc').onSnapshot((querySnapshot) => {
  //       const users: User[] = [];
  //       querySnapshot.docs.forEach(function (doc) {
  //         const user: User = new User();
  //         user.map(doc.data(), doc.id);
  //         users.push(user);
  //       });
  //       observer.next(users);
  //     });
  //   });

  // }

  getUsersByUsername(username): Observable<User[]> {

    // Returning has observable so list update itself when running a new report or deleting one
    return new Observable(observer => {
      this.db.firestore().collection('users').where('username', '==', username).onSnapshot((querySnapshot) => {
        const users: User[] = [];
        querySnapshot.docs.forEach(function (doc) {
          const user: User = new User();
          user.map(doc.data(), doc.id);
          users.push(user);
        });
        observer.next(users);
      });
    });

  }

  getUsersByEmail(email): Observable<User[]> {

    // Returning has observable so list update itself when running a new report or deleting one
    return new Observable(observer => {
      this.db.firestore().collection('users').where('email', '==', email).onSnapshot((querySnapshot) => {
        const users: User[] = [];
        querySnapshot.docs.forEach(function (doc) {
          const user: User = new User();
          user.map(doc.data(), doc.id);
          users.push(user);
        });
        observer.next(users);
      });
    });

  }

  getUsersByDate(startDate: Date, endDate: Date): Observable<User[]> {

    endDate.setHours(23);
    endDate.setMinutes(59);
    endDate.setSeconds(59);
    
    // Returning has observable so list update itself when running a new report or deleting one
    return new Observable(observer => {
      this.db.firestore().collection('users').where('createdAt', '>=', startDate).where('createdAt', '<=', endDate).orderBy('createdAt', 'desc').onSnapshot((querySnapshot) => {
        const users: User[] = [];
        querySnapshot.docs.forEach(function (doc) {
          const user: User = new User();
          user.map(doc.data(), doc.id);
          users.push(user);
        });
        observer.next(users);
      });
    });

  }

  updateUser(user: User): Promise<boolean> {
    return this.db.firestore().collection('users').doc(user.id).update(Object.assign({}, user)).then(ref => {
      return true;
    }).catch(error => {
      return false;
    });
  }

}
