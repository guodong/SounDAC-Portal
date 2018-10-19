// Core
import { Component, Input } from '@angular/core';
import { SdacAccount } from '../../../models/sdac-account';

@Component({
  selector: 'advance-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss']
})
export class AdvancePermissionsComponent {

  constructor() { }

  @Input() account: SdacAccount = new SdacAccount();

  // Keys
  showPrivateBasic: boolean = false;
  showPrivateActive: boolean = false;
  showPrivateOwner: boolean = false;
  showPrivateMemo: boolean = false;

  togglePrivateKey(key: string) {

    if (key === 'basic') {
      this.showPrivateBasic = !this.showPrivateBasic;
    }

    if (key === 'active') {
      this.showPrivateActive = !this.showPrivateActive;
    }

    if (key === 'owner') {
      this.showPrivateOwner = !this.showPrivateOwner;
    }

    if (key === 'memo') {
      this.showPrivateMemo = !this.showPrivateMemo;
    }

  }

}
