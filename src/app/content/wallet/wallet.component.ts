// Core
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MatTableDataSource, MatPaginator } from '@angular/material';

// Services
import { AlertService } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
import { CoinMarketCapService } from '../../services/coin-market-cap.service';
import { SdacService } from '../../services/sdac.service';
import { UIService } from '../../services/ui.service';

// Models
import { SdacAccountHistory } from '../../models/sdac-account-history';
import { SdacAccount } from '../../models/sdac-account';
import { SdacKeys } from '../../models/sdac-keys';
import { Subscription } from '../../../../node_modules/rxjs/Subscription';

@Component({
  selector: 'wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit, OnDestroy {

  constructor(
    private alert: AlertService,
    private auth: AuthService,
    private coinMarketCapService: CoinMarketCapService,
    private fb: FormBuilder,
    private formBuilder: FormBuilder,
    
    private sdacService: SdacService,
    private router: Router,
    private ui: UIService
  ) {

  }

  subscription: Subscription;
  account: SdacAccount = new SdacAccount();
  username: any;  
  marketCap: any;

  ngOnInit() {

    this.ui.showLoading();

    // Get Username
    this.subscription = this.auth.user$.map(user => {

      if (user) {

        this.username = user.username;

        // Get Account Infos
        this.getAccount();
        this.getPrivateKeys(); // Loading Private keys until blockchain fork happens - Require Active keys for most transactions
        this.getMarketCap();

      }

    }).subscribe();

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

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

  getMarketCap() {
    this.coinMarketCapService.getMarketCap().subscribe(response => {
      this.marketCap = response[0];
    });
  }

}
