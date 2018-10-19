
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatDialogRef, MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { ModalTransferComponent } from './modals/modal-transfer.component';
import { ModalDialogVestComponent } from './modals/modal-vest.component';
import { ModalWithdrawComponent } from './modals/modal-withdraw.component';
import { ModalRedeemComponent } from './modals/modal-redeem.component';
import { SdacAccountHistory } from '../../../models/sdac-account-history';
import { SdacAccount } from '../../../models/sdac-account';
import { SdacService } from '../../../services/sdac.service';
import { UIService } from '../../../services/ui.service';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'wallet-balances',
  templateUrl: './balances.component.html',
  styleUrls: ['./balances.component.scss']
})
export class WalletBalancesComponent implements OnInit {

  constructor(
    private alert: AlertService,
    private dialog: MatDialog,
    private sdacService: SdacService,
    private ui: UIService
  ) { }

  @Input() account: SdacAccount;
  @Input() username: string;

  defaultDate: Date = new Date('1969-12-31T23:59:59');  
  dialogRefTrans: MatDialogRef<ModalTransferComponent>;
  dialogRefVest: MatDialogRef<ModalDialogVestComponent>;
  dialogRefWithd: MatDialogRef<ModalWithdrawComponent>;
  dialogRefRedeem: MatDialogRef<ModalRedeemComponent>;

  // Account History
  @ViewChild('paginator') paginator: MatPaginator;

  dataSource = new MatTableDataSource<SdacAccountHistory>();
  displayedColumnsHistory = ['date', 'transaction'];

  ngOnInit() { 
    this.getAccountHistory();
  }

  getAccountHistory() {
    this.sdacService.getAccountHistory(this.username).then((response: SdacAccountHistory[]) => {
      this.account.history = response;
      this.dataSource.data = response;
      this.dataSource.paginator = this.paginator;
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

}
