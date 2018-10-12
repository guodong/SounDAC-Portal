// Core
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';

// Services
import { AuthService } from '../../services/auth.service';
import { SdacService } from '../../services/sdac.service';
import { UIService } from '../../services/ui.service';

// Models
import { SdacAccount } from '../../models/sdac-account';
import { SdacKeys } from '../../models/sdac-keys';
import { SdacWitness } from '../../models/sdac-witness';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'advance',
  templateUrl: './advance.component.html',
  styleUrls: ['./advance.component.scss']
})
export class AdvanceComponent implements OnInit, OnDestroy {

  constructor(
    private auth: AuthService,
    private sdacService: SdacService,
    private ui: UIService
  ) { }

  @ViewChild('paginatorWitness') paginatorWitness: MatPaginator;

  account: SdacAccount = new SdacAccount();
  subscription: Subscription;
  username: any;

  // Keys
  showPrivateBasic: boolean = false;
  showPrivateActive: boolean = false;
  showPrivateOwner: boolean = false;
  showPrivateMemo: boolean = false;

  // Witness
  WitnessListArray: SdacWitness[] = [];
  dataSourceWitness = new MatTableDataSource<SdacWitness>(this.WitnessListArray);
  displayedColumnsWitness = ['owner', 'block', 'url'];
  inputWitness: string;

  // Claim of Stake
  inputWIF: string;

  ngOnInit() {

    this.ui.showLoading();

    // Get Username
    this.subscription = this.auth.user$.map(user => {

      if (user) {

        // this.auth.user = user; // Update User
        this.username = user.username;

        // Get Account Infos
        this.getAccount();
        this.getPrivateKeys(); // Loading Private keys until blockchain fork happens - Require Active keys for most transactions
        this.getWitnesses();

      }

    }).subscribe();

  }

  ngOnDestroy() { }


  getAccount() {

    // Get Initial Account Info
    this.sdacService.getAccount(this.username).then(response => {
      this.account.mapAccount(response[0]);
      this.ui.hideLoading();
    });

    // Stream Account info for changes
    this.sdacService.streamAccountInfo$(this.username).subscribe(response => {
      this.account.mapAccount(response[0]);
      this.ui.hideLoading();
    });

  }

  getPrivateKeys() {
    const password = this.auth.user.getPassword();
    this.auth.getPrivateKeys(this.username, password).then((keys: SdacKeys) => {

      this.account.keys.basic = keys.basic;
      this.account.keys.active = keys.active;
      this.account.keys.owner = keys.owner;
      this.account.keys.memo = keys.memo;

    });
  }

  getWitnesses() {
    this.sdacService.getWitnesses().then(((result: any[]) => {
      result.forEach(res => {
        const witness: SdacWitness = new SdacWitness();
        witness.mapWitness(res);
        // this.WitnessListArray.push(witness);
        this.dataSourceWitness.data.push(witness);
      });
      this.dataSourceWitness.paginator = this.paginatorWitness;
    }));
  }

  loadPrivateKeys() {
    const password = this.auth.user.getPassword();
    this.auth.getPrivateKeys(this.username, password).then((keys: SdacKeys) => {
      this.account.keys.basic = keys.basic;
      this.account.keys.active = keys.active;
      this.account.keys.owner = keys.owner;
      this.account.keys.memo = keys.memo;
    });
  }

  togglePrivatekeys(key: string) {

    if (key === 'basic') {
      if (!this.showPrivateBasic) {
        if (this.account.keys.basic === '') {
          this.loadPrivateKeys();
        }
        this.showPrivateBasic = true;
      } else {
        this.showPrivateBasic = false;
      }
    }

    if (key === 'active') {
      if (!this.showPrivateActive) {
        if (this.account.keys.active === '') {
          this.loadPrivateKeys();
        }
        this.showPrivateActive = true;
      } else {
        this.showPrivateActive = false;
      }
    }

    if (key === 'owner') {
      if (!this.showPrivateOwner) {
        if (this.account.keys.owner === '') {
          this.loadPrivateKeys();
        }
        this.showPrivateOwner = true;
      } else {
        this.showPrivateOwner = false;
      }
    }

    if (key === 'memo') {
      if (!this.showPrivateMemo) {
        if (this.account.keys.memo === '') {
          this.loadPrivateKeys();
        }
        this.showPrivateMemo = true;
      } else {
        this.showPrivateMemo = false;
      }
    }

  }

  voteWitness(witnessOwner: string, vote: boolean) {
    this.ui.showLoading();
    const password = this.auth.user.getPassword();
    this.auth.getPrivateKeys(this.username, password).then((keys: SdacKeys) => {

      this.account.keys.basic = keys.basic;
      this.account.keys.active = keys.active;
      this.account.keys.owner = keys.owner;
      this.account.keys.memo = keys.memo;

      this.sdacService.voteWitness(this.username, this.account.keys.active, witnessOwner, vote);

    });
  }

  claimWIF() {
    this.ui.showLoading();
    // this.sdacService.claimBalance(this.username, this.inputWIF); // ToDo: Check Muse-js library to figure source of current error
  }


}
