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

// Modals
import { ModalTransferComponent } from './modal/modal-transfer.component';
import { ModalDialogVestComponent } from './modal/modal-vest.component';
import { ModalWithdrawComponent } from './modal/modal-withdraw.component';
import { ModalRedeemComponent } from './modal/modal-redeem.component';

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
    private dialog: MatDialog,
    private sdacService: SdacService,
    private router: Router,
    private ui: UIService
  ) {

    // Password Form
    this.passwordForm = fb.group({
      password: fb.control('', Validators.required),
      newPassword: fb.control('', Validators.required),
      confirmPassword: fb.control('', Validators.required),
      understand: fb.control(null, Validators.required),
      saved: fb.control(null, Validators.required)
    });

  }

  @ViewChild('paginator') paginator: MatPaginator;

  subscription: Subscription;
  username: any;
  passwordForm: FormGroup;
  account: SdacAccount = new SdacAccount();
  defaultDate: Date = new Date('1969-12-31T23:59:59');
  generatedPassword: string;
  CurrentPass: string;
  marketCap: any;

  dialogRefTrans: MatDialogRef<ModalTransferComponent>;
  dialogRefVest: MatDialogRef<ModalDialogVestComponent>;
  dialogRefWithd: MatDialogRef<ModalWithdrawComponent>;
  dialogRefRedeem: MatDialogRef<ModalRedeemComponent>;

  // Account History
  dataSource = new MatTableDataSource<SdacAccountHistory>(this.account.history);
  displayedColumnsHistory = ['date', 'transaction'];

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
        this.getAccountHistory();
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
      this.getAccountHistory();
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

  getAccountHistory() {
    this.sdacService.getAccountHistory(this.username).then((response: SdacAccountHistory[]) => {
      this.account.history = response;
      this.dataSource.data = response;
      this.dataSource.paginator = this.paginator;
    });
  }

  getMarketCap() {
    this.coinMarketCapService.getMarketCap().subscribe(response => {
      this.marketCap = response[0];
    });
  }

  transferXsd() {

    // const authPassword = this.auth.user.getPassword();

    this.dialogRefTrans = this.dialog.open(ModalTransferComponent);
    this.dialogRefTrans.afterClosed().subscribe(data => {
      if (data) {
        this.ui.showLoading();
        this.sdacService.transferXsd(this.username, this.account.keys.active, data.transferto.toLowerCase(), data.amount, data.memo); // ... - Change active key back to password once blockchain fork happens
      }
    });

  }

  redeemRylt() {
    this.dialogRefRedeem = this.dialog.open(ModalRedeemComponent, {
      data: {
        balance: this.account.MBDbalance
      }
    });
    this.dialogRefRedeem.afterClosed().subscribe(data => {
      if (data) {
        this.ui.showLoading();
        this.sdacService.redeemRylt(this.username, this.account.keys.active, data); // ... - Change active key back to password once blockchain fork happens
      }
    });

  }

  vestXsd() {
    this.dialogRefVest = this.dialog.open(ModalDialogVestComponent, {
      data: {
        balance: this.account.XsdBalance
      }
    });
    this.dialogRefVest.afterClosed().subscribe(data => {
      if (data) {
        this.ui.showLoading();
        this.sdacService.transferXsdtoVest(this.username, this.account.keys.active, data); // ... - Change active key back to password once blockchain fork happens
      }
    });
  }

  withdrawVest() {
    this.dialogRefWithd = this.dialog.open(ModalWithdrawComponent, {
      data: {
        balance: this.account.Vestbalance
      }
    });
    // const authPassword = this.auth.user.getPassword();
    this.dialogRefWithd.afterClosed().subscribe(data => {
      if (data) {
        this.ui.showLoading();
        this.sdacService.withdrawVesting(this.username, this.account.keys.active, data).then(response => {
          if (response === 'Success') {
            this.alert.showCustomMessage('', 'Success!');
          }
        }); // ... - Change active key back to password once blockchain fork happens
      }
    });
  }

  cancelWithdraw() {
    this.ui.showLoading();
    // const authPassword = this.auth.user.getPassword();
    this.sdacService.withdrawVesting(this.username, this.account.keys.active, 0).then(response => {
      if (response === 'Success') {
        this.alert.showCustomMessage('', 'Success!');
      } else {
        this.alert.showCustomMessage('Alert', 'No VIP Exits pending.');
      }

    }); // ... - Change active key back to password once blockchain fork happens
  }

  generatePassword() {

    this.generatedPassword = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!$%^&*()_+|~-={}[]:;?./';

    const tmpPwd: string[] = [];
    for (let i = 0; i < 52; i++) {
      tmpPwd.push(characters.charAt(Math.floor(Math.random() * characters.length)));
    }

    this.generatedPassword = tmpPwd.join('');

  }

  passwordMatch() {
    if (this.passwordForm.get('newPassword').value === this.passwordForm.get('confirmPassword').value) {
      return true;
    }
    this.passwordForm.get('confirmPassword').setErrors({ MatchPassword: true });
    return false;
  }

  updatePassword() {
    this.ui.showLoading();

    const truePassword: string = this.auth.user.getPassword();
    const password: string = this.passwordForm.get('password').value;
    const newPassword: string = this.passwordForm.get('newPassword').value;

    let errors: boolean = false;

    if (password !== truePassword) {
      this.alert.showErrorMessage('auth/wrong-password');
      this.passwordForm.get('password').reset();
      errors = true;
      this.ui.hideLoading();
    }

    if (!errors) {
      // Get a set of new Keys based on the new generated password
      this.auth.getPrivateKeys(this.username, newPassword).then((keys: SdacKeys) => {
        // Update the actual keys with the new password
        this.auth.updateAccountKeys(this.username, password, newPassword, keys.ownerPubkey, keys.activePubkey, keys.basicPubkey, keys.memoPubkey)
          .then((response: boolean) => {
            this.ui.hideLoading();
            if (response) {
              this.generatedPassword = null;
              this.passwordForm.reset();
            }
          });

      });

    }

  }

}
