import { Component, OnInit, ViewChild } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { LoadingDialogComponent } from './layout/dialogs/loading/loading.dialog.component';
import { UIService } from './services/ui.service';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';

import * as firebase from 'firebase/app';
import 'firebase/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private mediaMatcher: MediaMatcher,
    private ui: UIService,
    private router: Router,
  ) { }

  @ViewChild('sidenav') sidenav;
  mediaQueryList;

  ngOnInit() {
    this.mediaQueryList = this.mediaMatcher.matchMedia('(max-width: 768px)');

    // Enable Temporary via firebase
    firebase.app('rightsManagementPortal').firestore().collection('settings').doc('temporary').onSnapshot((querySnapshot) => {
      const setting: any = querySnapshot.data();
      if (setting.enabled) {
        this.router.navigateByUrl('/temporary');
      } else {
        this.router.navigateByUrl('/');
      }
    });

    // Enable Temporary via environement
    if (environment.temporary) {
      this.router.navigateByUrl('/temporary');
    }

  }

  sidenavToggle() {
    this.sidenav.toggle();
  }

}
